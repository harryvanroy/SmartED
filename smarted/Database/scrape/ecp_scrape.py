import bs4 as bs
import urllib.request


def get_course_assessment(course_code, semester=None, year=None, delivery_mode=None):
    """
    A function which takes a uq course code, semester and delivery mode and returns a list of dictionaries
    of assessment pieces for that given course in the given semester and delivery mode
    :param course_code: the uq course code (e.g. coms3200, deco3801)
    :param semester: an integer of the sem number
    :param year: an integer of the year
    :param delivery_mode: a string of either "INTERNAL", "EXTERNAL", or "FLEXIBLE"
    :return: a  list of dictionaries representing assignments, where each assignment has: "name", "date" and "weight"
    """

    # format delivery mode correctly
    if delivery_mode == "INTERNAL" or delivery_mode == "I":
        delivery_mode = "Internal"
    elif delivery_mode == "EXTERNAL" or delivery_mode == "E":
        delivery_mode = "External"
    elif delivery_mode == "FLEXIBLE" or delivery_mode == "F":
        delivery_mode = "Flexible Delivery"

    # todo: formatting of course code for certain user error entries
    course_url = f"https://my.uq.edu.au/programs-courses/course.html?course_code={course_code}"

    # todo: error handling and headers
    request = urllib.request.Request(course_url, headers={"User-agent": "Mozilla/5.0"})
    response = urllib.request.urlopen(request)
    data = response.read()
    soup = bs.BeautifulSoup(data, 'lxml')

    if soup.tbody is None:
        print(f"No table found for course code '{course_code}'...")
        return False

    # if no semester or year specified, pick first index course profile
    ecp_url = soup.tbody.find("a", {"class": "profile-available"}).get('href')

    if semester is not None and year is not None and delivery_mode is not None:
        found = False
        for course_offering in soup.tbody.find_all('tr'):
            course_mode = course_offering.find("td", {"class": "course-offering-mode"}).text
            course_time = course_offering.find("a", {"class": "course-offering-year"}).text
            # print(course_time, f"Semester {semester}, {year}", course_mode, delivery_mode)
            if (course_time == f"Semester {semester}, {year}") and (course_mode == delivery_mode):
                ecp_url = course_offering.find("td", {"class": "course-offering-profile"}).find("a").get('href')
                found = True

        if not found:
            print("could not find matching course year/semester/mode, using default..")

    request = urllib.request.Request(ecp_url, headers={"User-agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(request).read()
    soup = bs.BeautifulSoup(data, 'lxml')

    ecp_links = soup.find("ul", {"class": "toc-node"}).find_all("li")
    assessment_url = [i.a.get('href') for i in ecp_links if ". Assessment" in i.text][0]
    # old backup method below
    # assessment_url = soup.find("ul", {"class": "toc-node"}).find_all("li")[4].find("a").get('href')

    request = urllib.request.Request(assessment_url, headers={"User-agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(request).read()
    soup = bs.BeautifulSoup(data, 'lxml')

    rows = soup.tbody.find_all("tr")

    course_assessment_list = []
    for row in rows:
        cols = row.find_all("td")
        text = [i.text.replace("  ", "").replace('\n\n', ' ') for i in cols]

        weight_txt = text[2].replace('\n', '')
        isPassFail = False
        
        if "%" in weight_txt:
            weight = float(weight_txt.split("%")[0])
        elif "Pass" in weight_txt or "pass" in weight_txt:
            isPassFail = True
            weight = 0
        else:
            weight = 0
        

        assessment = {"name": text[0], "date": text[1].replace('\n', ''),
                      "weight": weight, "isPassFail": isPassFail}
        course_assessment_list.append(assessment)

    return course_assessment_list


if __name__ == "__main__":
    print("test mode!")
    course = input("enter a course code: ")
    year = input("enter a year: ")
    semester = input("enter a semester number: ")
    mode = input("enter a delivery mode ('Internal', 'External' or 'Flexible Delivery'): ")
    print("loading data...\n")
    ass_list = get_course_assessment(course, semester, year, mode)

    if ass_list is not False:
        print(f"Assessment list for {course} {year} {semester} {mode}:")
        for ass in ass_list:
            print(ass)
