# SmartED

Team Pogware's DECO3801 project.

## Install Guide

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

## Build Guide

To build the reactapp for django to use, first navigate to the reactapp directory. 
`/smarteducation/reactapp/`

Then, if it is the first time building or new node packages have been added, run `npm install` to install all node dependencies.

Then, run `npm run build`.

this will build all the react components in an index.html file which django uses.
 
After this, django can be run normally (i.e. cd to `/smarteducation/` and run `python manage.py runserver`), and the base url `localhost:8000` will now show the contents of the compiled reactapp.

 `npm run build` should be ran each time there is changes to the react app
