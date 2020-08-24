class Question:
    def __init__(self, num, query, a, b, c, d):
        self.num = num
        self.query = query
        self.a = a
        self.b = b
        self.c = c
        self.d = d

def parse_questions(filename):
    questions = []
    with open(filename, "r") as file:
        for question in range(16):
            query = file.readline()[3:]
            a = file.readline()[3:]
            b = file.readline()[3:]
            c = file.readline()[3:]
            d = file.readline()[3:]
            current_question = Question(question+1, query, a, b, c, d)
            questions.append(current_question)
    return questions

#asks user questions and records responses
def quiz(questions):
    answers = []
    intro_message = 'This quiz will evalulate your learning style. Answer questions by typing the response/s you agree with, eg if you only agree with A, type "A", and if you agree with both B and C, type "BC"\n©2019 VARK-Learn Limited http://vark-learn.com'
    print(intro_message, '\n')

    for question in range(16):
        current_question = questions[question]
        current_ans = [False, False, False, False]

        print("Question", question+1)
        print(current_question.query)
        print("A)", current_question.a)
        print("B)", current_question.b)
        print("C)", current_question.c)
        print("D)", current_question.d)

        user_ans = input("Your answer/s: ")
        current_ans[0] = True if "A" in user_ans else False
        current_ans[1] = True if "B" in user_ans else False
        current_ans[2] = True if "C" in user_ans else False
        current_ans[3] = True if "D" in user_ans else False
        answers.append(current_ans)  

    return answers

#scoring table: each list represents the learning type associated with the 
#response a, b, c or d for each question
scoring = [['K', 'A', 'R', 'V'],
           ['V', 'A', 'R', 'K'],
           ['K', 'V', 'R', 'A'],
           ['K', 'A', 'V', 'R'],
           ['A', 'V', 'K', 'R'],
           ['K', 'R', 'V', 'A'],
           ['K', 'A', 'V', 'R'],
           ['R', 'K', 'A', 'V'],
           ['R', 'A', 'K', 'V'],
           ['K', 'V', 'R', 'A'],
           ['V', 'R', 'A', 'K'],
           ['A', 'R', 'V', 'K'],
           ['K', 'A', 'R', 'V'],
           ['K', 'R', 'A', 'V'],
           ['K', 'A', 'R', 'V'],
           ['V', 'A', 'R', 'K']]

#takes a completed quiz answer set and scores according to VARK metrics
def score(answers):
    #keep track of number of positive responses for each learning type
    vark_counts = {'V' : 0, 'A' : 0, 'R' : 0, 'K' : 0}
    for question in range(16):
        for response in range(4):
            if answers[question][response]:
                vark_counts[scoring[question][response]] += 1
    score_total = sum(vark_counts.values())
    print('Visual:', vark_counts['V']/score_total)
    print('Aural:', vark_counts['A']/score_total)
    print('Read/write:', vark_counts['R']/score_total)
    print('Kinesthetic:', vark_counts['K']/score_total)

def main():
    questions = parse_questions("vark_questions.txt")
    score(quiz(questions))

if __name__ == '__main__':
    main()