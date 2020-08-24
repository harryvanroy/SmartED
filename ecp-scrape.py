import bs4 as bs
import urllib.request


def get_course_assessment(course_code, semester=None, delivery_mode=None):
    """
    A function which takes a uq course code, semester and delivery mode and returns a list of dictionaries
    of assessment pieces for that given course in the given semester and delivery mode
    :param course_code: the uq course code (e.g. coms3200, deco3801)
    :param semester: todo: implement this
    :param delivery_mode: todo: implement this.. will be either internal, external or flexy
    :return: a  list of dictionaries representing assignments, where each assignment has: "name", "date" and "weight"
    """

    # todo: formatting of course code for certain user error entries
    course_url = f"https://my.uq.edu.au/programs-courses/course.html?course_code={course_code}"

    # todo: error handling and headers
    request = urllib.request.Request(course_url, headers={"User-agent": "Mozilla/5.0"})
    response = urllib.request.urlopen(request)
    data = response.read()
    soup = bs.BeautifulSoup(data, 'lxml')

    """ todo: this is where semester and delivery mode will play a role, at the moment, the ecp link is found by just
    selecting the 1th index of the course offerings list, it instead needs to select the course offering
    which matches the sem and mode.. """
    ecp_url = soup.tbody.find_all('a')[1].get('href')

    request = urllib.request.Request(ecp_url, headers={"User-agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(request).read()
    soup = bs.BeautifulSoup(data, 'lxml')

    """ todo: this assumes that the Assessment link is always the 4th indexed list item, however it might not be. 
    Instead it should check for which list item has the text "assessment" and navigate to that href..
    """
    assessment_url = soup.find("ul", {"class": "toc-node"}).find_all("li")[4].find("a").get('href')

    request = urllib.request.Request(assessment_url, headers= {"User-agent": "Mozilla/5.0"})
    data = urllib.request.urlopen(request).read()
    soup = bs.BeautifulSoup(data, 'lxml')

    rows = soup.tbody.find_all("tr")

    course_assessment_list = []
    for row in rows:
        cols = row.find_all("td")
        text = [i.text.replace("  ", "").replace('\n\n', ' ') for i in cols]
        assessment = {"name": text[0], "date": text[1].replace('\n', ''), "weight": text[2].replace('\n', '')}
        course_assessment_list.append(assessment)

    return course_assessment_list


if __name__ == "__main__":
    print("test mode!")
    course_code = input("enter a course code: ")
    print("loading data...\n")
    ass_list = get_course_assessment(course_code)
    print(f"Assessment list for {course_code}:")
    for ass in ass_list:
        print(ass)
