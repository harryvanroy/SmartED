### unsure if we need this, here for archive


def blackboard_scrape(username, pword, chrome=False):
    scraper = UQBlackboardScraper(username, pword, chrome=chrome)

    print("getting courses...")
    # get courses
    raw_dict = scraper.get_current_courses()

    if len(raw_dict) == 0:
        return False

    if len(Institution.objects.filter(name="University of Queensland")) == 0:
        UQ = Institution(name="University of Queensland")
        UQ.save()
        print("made uq institution")

    raw_courses = [raw_dict.get(key) for key in raw_dict.keys()]

    print("debug: ", raw_courses)

    for course in raw_courses:
        code = course['code'].split('/')[0]
        mode = course['delivery']

        # note: below needs testing
        if 'internal' in mode:
            mode = 'INTERNAL'
        elif 'external' in mode:
            mode = 'EXTERNAL'

        sem = int(course['semester'].split()[1])
        year = int(course['year'])

        if len(Course.objects.filter(name=code, mode=mode,
                                     semester=sem, year=year)) == 0:
            # course not already in database
            print("saving course...")
            UQ = Institution.objects.get(name="University of Queensland")
            course_obj = Course(name=code, mode=mode, semester=sem,
                                year=year, institution=UQ)
            course_obj.save()

        course_obj = Course.objects.filter(name=code, mode=mode,
                                           semester=sem, year=year)[0]

        if len(StudentCourse.objects.filter(student=student, course=course_obj)) == 0:
            print("saving studentCourse...")
            stu_course = StudentCourse(student=student, course=course_obj)
            stu_course.save()

    # add resources to database and whatever else here

    return True