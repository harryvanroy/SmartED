import requests

session = requests.Session()

cookies = {
    'fs92prod-PSJSESSIONID': 'qGBxqOZESJOCTfK9aBPiP24Ni3CtGyyZ^!-1604905287',
    'UQIDPSessionID': '76b8d7102ede3b8edec6d13394542fbe',
    'UQIDPAuthToken': '_b413e187e02b40e6a454f2de3390417f94b4d4e84a',
    'uqlb': '^!JfjrM1z5djO1iXAPxazRKhPpmYFhNFIlcJpb1xsBvYbO1O86h51KC7W0cEg9CTayIOHQvXKt4OgbIA==',
}

headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Origin': 'https://auth.uq.edu.au',
    'Upgrade-Insecure-Requests': '1',
    'DNT': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Referer': 'https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php?AuthState=_a863803000be7315d10f754b3072b6b2b87ba9aab2^%^3Ahttps^%^3A^%^2F^%^2Fauth.uq.edu.au^%^2Fidp^%^2Fmodule.php^%^2Fcore^%^2Fas_login.php^%^3FAuthId^%^3Duq^%^26ReturnTo^%^3Dhttps^%^253A^%^252F^%^252Fauth.uq.edu.au^%^252Fidp^%^252Fmodule.php^%^252Fcore^%^252Fauthenticate.php^%^253Fas^%^253Duq',
    'Accept-Language': 'en-US,en;q=0.9',
}

data = {
  'username': '',
  'password': '',
  'submit': 'LOGIN',
  'AuthState': '_a863803000be7315d10f754b3072b6b2b87ba9aab2^%^3Ahttps^%^3A^%^2F^%^2Fauth.uq.edu.au^%^2Fidp^%^2Fmodule.php^%^2Fcore^%^2Fas_login.php^%^3FAuthId^%^3Duq^%^26ReturnTo^%^3Dhttps^%^253A^%^252F^%^252Fauth.uq.edu.au^%^252Fidp^%^252Fmodule.php^%^252Fcore^%^252Fauthenticate.php^%^253Fas^%^253Duq'
}

response = session.post('https://auth.uq.edu.au/idp/module.php/core/loginuserpass.php', headers=headers, cookies=cookies, data=data)

print(response.text)

response = session.get('https://learn.uq.edu.au/')

print(response.text)