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
#driver.find_element_by_xpath('//*[@name="submit"]').click()

# Transfer the selenium cookies to a requests session
url = "https://learn.uq.edu.au/"
s = requests.Session()
c = [s.cookies.set(c['name'], c['value']) for c in driver.get_cookies()]

data = {
  'username': lines[0],
  'password': lines[1]
}

# Response 200 means we're in and it's working :) 
response = s.post(url, data)
if response.status_code != 200:
    print("FAILED TO PASS AUTHENTICATION")
    exit()
print(response)

# NO CAPTCHAS!!!
response = s.get(url)
print(response.text)
# We can now proceed with scraping :)

# close chrome






