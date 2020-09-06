from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time

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
#driver.find_element_by_xpath('//*[@name="submit"]').click()

# Find recent courses
courses = driver.find_elements_by_xpath("//a[contains(text(), 'Semester 2, 2020')]")

# Click on each course (broken)
for course in courses:
    course.click()
    # Dies here, whoops

time.sleep(20)
