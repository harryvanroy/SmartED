# SmartED

Team Pogware's DECO3801 project.

## SetUp Guide

To run the django web server, a version of python above 3.6 is required. On MAC 
to install python run

`brew install python`

On windows typing `python3` into the command line will open the windows store.

Next install the python package `virtualenv` with

`pip3 install virtualenv`

then navigate to the local project directory - this should be where `git init` 
was run. Now create a new virtual environment and activate it.

`virtualenv SmartED`

To activate on MAC use

`source SmartED/bin/activate`

and on Windows use

`SmartED\Scripts\activate`

Virtualenv allows us to keep track of our dependencies throughout the build. If
we add python libraries during development, simply running 
`pip3 freeze > requirements.txt` saves the changes for everyone.

To install the necessary dependencies begin with

`pip3 install -r requirements.txt`

Now enter into the project directory `cd SmartEducation` and run the webserver 
`python manage.py runserver`.
