from django.test import TestCase
from selenium import webdriver
from selenium.common.exceptions import InvalidArgumentException, NoSuchElementException
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import os

class SeleniumTestCase(TestCase):

    def testFirefoxInit(self):
        if os.environ.get("USER") and os.environ.get("USER") == "www-data":
            os.mkdir("/tmp/www_fake_home/")
            os.environ["HOME"] = "/tmp/www_fake_home/"
        print("starting driver as firefox")
        options = webdriver.FirefoxOptions()
        options.add_argument("--headless")
        self.driver = webdriver.Firefox(options=options)
        print("driver loaded")
        self.assertEqual(True, True)

