from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import requests

# Variables
f = open("auth.txt","r")
lines = f.readlines()
studentNumber = lines[0]
UQPassword = lines[1]
f.close()
sendDelay = 1

# Opens UQ auth
driver = webdriver.Chrome(ChromeDriverManager().install())
driver.get('https://learn.uq.edu.au/')

driver.implicitly_wait(10)
# Login
driver.find_element_by_xpath('//*[@id="username"]').send_keys(studentNumber)
driver.find_element_by_xpath('//*[@id="password"]').send_keys(UQPassword)
driver.find_element_by_xpath('//*[@name="submit"]').click()

# Use selenium to browse page and steal resources
url = "https://learn.uq.edu.au/webapps/portal/execute/tabs/tabAction?tab_tab_group_id=_1_1"
driver.get(url)

driver.implicitly_wait(10)
current_courses = driver.find_elements_by_xpath('//*[@id="module:_122_1"]/div[2]/nav/div[1]/ul/li')
course_links = []

for course in current_courses:
    link = course.find_element_by_xpath(".//a")
    course_id = link.get_attribute('href').split("%")[-3].split("_")[1]
    course_links.append(link.text)
    print(link.text)
    print(course_id)

driver.close()
driver.quit()





