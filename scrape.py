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

    def __init__(self, username, password, verbose=False):
        self.verbose = verbose
        # options = webdriver.ChromeOptions()
        # options.add_argument("--headless")
        # options.add_experimental_option('prefs', {
        #     "download.default_directory": "D:\garbage", #Change default directory for downloads
        #     "download.prompt_for_download": False, #To auto download the file
        #     "download.directory_upgrade": True,
        #     "plugins.always_open_pdf_externally": True #It will not show PDF directly in chrome
        #     }
        # )
        # self.driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)

        profile = webdriver.FirefoxProfile()
        profile.set_preference('browser.download.folderList', 2)
        # profile.set_preference('browser.download.manager.showWhenStarting', True)
        profile.set_preference('browser.download.dir', "D:\garbage")
        mime_types = "application/pdf,application/vnd.adobe.xfdf,application/vnd.fdf,application/vnd.adobe.xdp+xml"
        profile.set_preference('browser.helperApps.neverAsk.saveToDisk', mime_types)
        # profile.set_preference("plugin.disable_full_page_plugin_for_types", mime_types)

        profile.set_preference("browser.helperApps.alwaysAsk.force", False);
        profile.set_preference("browser.download.manager.useWindow", False);
        profile.set_preference("browser.download.manager.focusWhenStarting", False);
        profile.set_preference("browser.helperApps.neverAsk.openFile", "");
        profile.set_preference("browser.download.manager.alertOnEXEOpen", False);
        profile.set_preference("browser.download.manager.showAlertOnComplete", True);
        profile.set_preference("browser.download.manager.closeWhenDone", True);
        profile.set_preference("pdfjs.disabled", True)
        profile.update_preferences()

        options = webdriver.FirefoxOptions()
        #options.add_argument("--headless")

        ua = UserAgent()
        userAgent = ua.random
        print(userAgent)
        options.add_argument('user-agent={}'.format(userAgent))
        path=r"D:/University/2020Semester2/DECO3801/SmartED/geckodriver.exe"

        self.driver = webdriver.Firefox(firefox_profile=profile, options=options)

        self.driver.get(self.BLACKBOARD_URL)

        # Load
        self.driver.implicitly_wait(10)
        # Login
        #     <input type="submit" id="postLoginSubmitButton">

        self.driver.find_element_by_xpath('//*[@id="username"]') \
            .send_keys(username)
        self.driver.find_element_by_xpath('//*[@id="password"]') \
            .send_keys(password)
        self.driver.find_element_by_xpath('//*[@name="submit"]') \
            .click()

    def get_learning_resources(self, course_id):
        self.driver.get(self.COURSE_URL % course_id)
        # self.driver.find_element_by_xpath('//*[@id="menuPuller"]') \
        #     .click()
        self.driver.find_element_by_xpath('//*[@title="Learning Resources"]') \
            .click()

        soup = BeautifulSoup(self.driver.page_source, 'html.parser')
        resource_list = soup.find('ul', class_='contentList')

        resources = {}

        for post in resource_list.find_all('li', class_="clearfix read"):
            # TODO: add checks for valid folders. Include search for links on LR page
            folder = post.find('img', class_="item_icon") # potentially useful
            name = post.find('a').get_text()
            
            # Execute system commend to create this directory and move files here.

            resource_id = int(post.attrs['id'].split(':')[1].split('_')[1])
            self.driver.get(self.RESOURCE_URL % (course_id, resource_id))
            
            links = []

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            pdfs = soup.find_all("span", class_="contextMenuContainer")
            for pdf in pdfs:
                link = pdf.parent.find('a').attrs['href']
                links.append(link)
                # Hangs the program... Not sure how to fix
                # try:
                #     self.driver.get(link)
                #     self.driver.back()
                # except InvalidArgumentException:
                #     pass

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
        self.driver.get(self.BLACKBOARD_URL)

        current_courses = self.driver.find_elements_by_xpath(
            '//*[@id="module:_122_1"]/div[2]/nav/div[1]/ul/li')

        courses = {}

        for course in current_courses:
            try:
                link = course.find_element_by_xpath(".//a")
            except NoSuchElementException:
                continue
            
            course_id = link.get_attribute('href').split("%")[-3].split("_")[1]

            # Unique identifier
            courses[int(course_id)] = {}

            # link.text looks like:
            # [COURSE_CODE] COURSE_NAME (St Lucia & external). 
            # Semester 2, 2020, Flexible Delivery
            course_info = courses[int(course_id)]
            last_break = 1
            for i in range(len(link.text)):
                if link.text[i] == ']':
                    course_info['code'] = link.text[last_break : i]
                    last_break = i + 2
                elif link.text[i] == '(':
                    course_info['name'] = link.text[last_break : i-1]
                    last_break = i + 1
                elif link.text[i] == ')':
                    course_info['delivery'] = link.text[last_break : i]
                    last_break = i + 3
                elif link.text[i] == ',' and course_info.get("semester", None) is None:
                    course_info['semester'] = link.text[last_break : i]
                    last_break = i + 2
                elif link.text[i] == ',':
                    course_info['year'] = link.text[last_break : i]
                
        return courses


if __name__ == "__main__":
    f = open("auth.txt", "r")
    lines = f.readlines()
    studentNumber = lines[0]
    UQPassword = lines[1]
    f.close()
    scraper = UQBlackboardScraper(studentNumber, UQPassword, verbose=True)
    courses = scraper.get_current_courses()
    scraper.get_learning_resources(132764)

