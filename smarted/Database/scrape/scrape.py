import os
from selenium import webdriver
from selenium.common.exceptions import InvalidArgumentException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager

from bs4 import BeautifulSoup

from fake_useragent import UserAgent

class UQBlackboardScraper:
    BLACKBOARD_URL = 'https://learn.uq.edu.au/'
    COURSE_URL = 'https://learn.uq.edu.au/webapps/blackboard/execute/announcement?method=search&context=course_entry&course_id=%d'
    RESOURCE_URL = 'https://learn.uq.edu.au/webapps/blackboard/content/listContent.jsp?course_id=%d&content_id=%d'

    def __init__(self, username, password, verbose=False, chrome=False):
        self.verbose = verbose

        if not chrome:
            try:
                os.mkdir("/tmp/www_fake_home/")
            except FileExistsError:
                pass
            os.environ["HOME"] = "/tmp/www_fake_home/"
            print("starting driver as firefox")
            options = webdriver.FirefoxOptions()
            options.add_argument("--headless")
            self.driver = webdriver.Firefox(options=options, service_log_path="/var/www/uwsgi/geckodriver.log")
        else:
            print("starting driver as chrome")
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_argument("--headless")
            self.driver = webdriver.Chrome(ChromeDriverManager().install(), options=chrome_options)

        self.driver.get(self.BLACKBOARD_URL)

        # Load
        self.driver.implicitly_wait(10)

        # Login
        self.driver.find_element_by_xpath('//*[@id="username"]') \
            .send_keys(username)
        self.driver.find_element_by_xpath('//*[@id="password"]') \
            .send_keys(password)
        self.driver.find_element_by_xpath('//*[@name="submit"]') \
            .click()

    def get_learning_resources(self, course_id):
        self.driver.get(self.COURSE_URL % course_id)
        self.driver.find_element_by_xpath('//*[@title="Learning Resources"]') \
            .click()

        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        resource_list = soup.find('ul', class_='contentList')

        resources = {}

        for post in resource_list.find_all('li', class_="clearfix read"):
            folder = post.find('img', class_="item_icon").attrs["alt"]
            name = post.find('a').get_text()
            resource_id = int(post.attrs['id'].split(':')[1].split('_')[1])

            self.driver.get(self.RESOURCE_URL % (course_id, resource_id))

            links = []

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            pdfs = soup.find_all("span", class_="contextMenuContainer")
            for pdf in pdfs:
                link = pdf.parent.find('a').attrs['href']
                links.append(link)

            resources[resource_id] = {"name": name, "type": folder, "links": links}

            if self.verbose:
                print("type: ", folder)
                print("name: ", name)
                print("Links found: ", links)

        return resources

    def get_course_announcements(self, course_id):
        self.driver.get(self.COURSE_URL % course_id)
        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        posts = soup.find('ul', id='announcementList')

        announced = {}

        for post in posts.find_all('li', class_='clearfix'):
            post_id = int(post.attrs['id'][1:-2])
            announced[post_id] = {}
            item = announced[post_id]

            item['title'] = post.find('h3').get_text().strip()
            item['content'] = post.find('div', class_='vtbegenerated').get_text().strip()
            item['date'] = post.find('div', class_='details') \
                               .find('p').get_text().split('Posted on:')[1][1:]

        return announced

    def get_current_courses(self):
        """
        REPLACE WITH BS parsing instead of selenium (SPEEED)
        """
        self.driver.get(self.BLACKBOARD_URL)
        current_courses = self.driver.find_elements_by_xpath(
            '//*[@id="module:_122_1"]/div[2]/nav/div[1]/ul/li')

        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        semesters = soup.find_all('div', class_="menu-item")
        current_courses = semesters[0].find_all('li')

        courses = {}

        for course in current_courses:
            link = course.find("a")
            if link is None:
                continue

            course_id = link.attrs['href'].split("%")[-3].split("_")[1]

            # Unique identifier
            courses[int(course_id)] = {}

            # link.text looks like:
            # [COURSE_CODE] COURSE_NAME (St Lucia & external). 
            # Semester 2, 2020, Flexible Delivery
            course_info = courses[int(course_id)]
            course_info['year'] = 2020
            course_info['semester'] = "Semester 2"
            last_break = 1
            for i in range(len(link.text)):
                if link.text[i] == ']':
                    course_info['code'] = link.get_text()[last_break: i]
                    last_break = i + 2
                elif link.text[i] == '(':
                    course_info['name'] = link.get_text()[last_break: i - 1]
                    last_break = i + 1
                elif link.text[i] == ')':
                    course_info['delivery'] = link.get_text()[last_break: i]
                    last_break = i + 3
                    
        return courses


if __name__ == "__main__":
    f = open("auth.txt", "r")
    lines = f.readlines()
    studentNumber = lines[0]
    UQPassword = lines[1]
    f.close()
    scraper = UQBlackboardScraper(studentNumber, UQPassword, verbose=True)
    courses = scraper.get_current_courses()
    print(courses)
    for course in courses.keys():
        resources = scraper.get_learning_resources(course)
        print(resources)
