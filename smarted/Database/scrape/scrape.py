import os
from selenium import webdriver
from selenium.common.exceptions import InvalidArgumentException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager

from bs4 import BeautifulSoup, SoupStrainer

from fake_useragent import UserAgent

class UQBlackboardScraper:
    """
    Selenium powered blackboard resource scraper, capable of scraping pages 
    of links, course names and subverting single sign on.
    """
    BLACKBOARD_URL = 'https://learn.uq.edu.au/'
    COURSE_URL = BLACKBOARD_URL + \
        'webapps/blackboard/execute/announcement?method=search&context=course_entry&course_id=%d'
    RESOURCE_URL = BLACKBOARD_URL + \
        'webapps/blackboard/content/listContent.jsp?course_id=%d&content_id=%d'

    def __init__(self, username, password, verbose=False, chrome=False):
        """
        Initialise selenium and login to blackboard

        Args:
            username (String): blackboard username
            password (String): blackboard password
            verbose (bool, optional): Enable stdout recording. Default False.
            chrome (bool, optional): Select driver based on 
                production / development. Default False.
        """
        self.verbose = verbose

        if not chrome:
            # Linux set up - Home set for Firefox profiles
            try:
                os.mkdir("/tmp/www_fake_home/")
            except FileExistsError:
                pass
            os.environ["HOME"] = "/tmp/www_fake_home/"
            print("starting driver as firefox")

            options = webdriver.FirefoxOptions()
            options.add_argument("--headless") # Run without a window
            self.driver = webdriver.Firefox(options=options,
                service_log_path="/var/www/uwsgi/geckodriver.log")
        else:
            print("starting driver as chrome")
            chrome_options = webdriver.ChromeOptions()
            chrome_options.add_argument("--kiosk")
            # chrome_options.add_argument("--headless")
            self.driver = webdriver.Chrome(ChromeDriverManager().install(), 
                options=chrome_options)

        self.driver.get(self.BLACKBOARD_URL)

        # Login
        self.driver.implicitly_wait(10)
        self.driver.find_element_by_xpath('//*[@id="username"]') \
            .send_keys(username)
        self.driver.find_element_by_xpath('//*[@id="password"]') \
            .send_keys(password)
        self.driver.find_element_by_xpath('//*[@name="submit"]') \
            .click()

    def find_items(self, soup):
        """
        Find each block of content on a page

        Args:
            soup (BeautifulSoup): soup class containing some html

        Returns:
            (BeautifulSoup): soup class containing resource items
        """
        items = soup.find('ul', class_='contentList')
        if items is None:
            return None
        return items.find_all('li', class_="clearfix read")
    
    def find_links(self, soup):
        """
        Find each link inside a block of content

        Args:
            soup (BeautifulSoup): soup class containing some html

        Returns:
            links (Set<String>): list of href.a and titles
        """
        links = {}
        for link in soup.find_all('a', href=True):
            if "contextMenu" in link['href']:
                continue
            elif "http" in link['href']:
                url = link['href']
            else:
                url = self.BLACKBOARD_URL[:-1] + link['href']
            links[url] = link.get_text()
        return links

    def read_page(self, course_id, resources):
        """
        Parse a page, collecting all resource links

        Args:
            course_id (int): Unique course identifier
            resources (Dict<int : Dict<String : String(s)>>): Set of resources
                for a particular course
        """
        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        page_items = self.find_items(soup)
        if page_items is None:
            return

        for item in page_items:
            folder = item.find('img', class_="item_icon").attrs["alt"]
            if item.find('h3') is None:
                continue
            name = item.find('h3').get_text().strip()
            resource_id = int(item.attrs['id'].split(':')[1].split('_')[1])
            resources[resource_id] = {"name": name, "type": folder, 
                "links": self.find_links(item)}

            # descend into folders
            if folder == "Content Folder":
                self.driver.get(self.RESOURCE_URL % (course_id, resource_id))
                self.read_page(course_id, resources)

    def get_learning_resources(self, course_id):
        """
        Access the learning resource section of a course

        Args:
            course_id (int): Unique course identifier

        Returns:
            (Dict<int : Dict<String : String(s)>>): Set of resources
                for a particular course
        """
        self.driver.get(self.COURSE_URL % course_id)
        self.driver.find_element_by_xpath('//*[@title="Learning Resources"]') \
            .click()
        resources = {}
        self.read_page(course_id, resources)
        return resources

    def get_course_assessment(self, course_id):
        """
        Access the assessment section of a course

        Args:
            course_id (int): Unique course identifier

        Returns:
            (Dict<int : Dict<String : String(s)>>): Set of resources
                for a particular course
        """
        self.driver.get(self.COURSE_URL % course_id)
        self.driver.find_element_by_xpath('//*[@title="Assessment"]').click()
        resources = {}
        self.read_page(course_id, resources)
        return resources
        
    def get_course_announcements(self, course_id):
        """
        Access the announcements of a course

        Args:
            course_id (int): Unique course identifier

        Returns:
            (Dict<int : Dict<String : String(s)>>): Set of announcements
                for a particular course
        """
        self.driver.get(self.COURSE_URL % course_id)
        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        posts = soup.find('ul', id='announcementList')

        announced = {}

        for post in posts.find_all('li', class_='clearfix'):
            post_id = int(post.attrs['id'][1:-2])
            announced[post_id] = {}
            item = announced[post_id]

            item['title'] = post.find('h3').get_text().strip()
            item['content'] = post.find('div', class_='vtbegenerated') \
                .get_text().strip()
            item['date'] = post.find('div', class_='details') \
                .find('p').get_text().split('Posted on:')[1][1:]

        return announced

    def get_current_courses(self):
        """
        Retrieve the course information for the current semester

        Returns:
            (Dict<int : Dict<String : String(s)>>): Set of courses
                for a particular course
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

            courses[int(course_id)] = {}
            course_info = courses[int(course_id)]
            course_info['year'] = 2020
            course_info['semester'] = "Semester 2"
            # link.text looks like:
            # [COURSE_CODE] COURSE_NAME (St Lucia & external)
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
    scraper = UQBlackboardScraper(studentNumber, UQPassword, chrome=True)
    courses = scraper.get_current_courses()
    print(courses)
    for course in courses.keys():
        print("\nNEXT COURSE = %s \n" % courses[course])
        # resources = scraper.get_course_announcements(course)
        # print(resources)
        resources = scraper.get_learning_resources(course)
        print(resources)
        resources = scraper.get_course_assessment(course)
        print(resources)
        break