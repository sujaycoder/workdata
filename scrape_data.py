#http://ukr.soopage.com/city/Kiev-page2.html
import requests
from bs4 import BeautifulSoup as bs
from selenium import webdriver as wb
from selenium.webdriver.common.by import By
chrmoe_opt = wb.ChromeOptions()
chrmoe_opt.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
chrmoe_opt.add_argument("--headless")
chrmoe_opt.add_argument("--disable-dev-ahm-usage")
chrmoe_opt.add_argument('--no-sandbox')
file = open("result.txt", 'w+')
for i in range(1, 3):
    url = "http://ukr.soopage.com/city/Kiev-page"+str(i)+".html"
    res = requests.get(url)
    if res.status_code == 200:
        data = bs(res.text, 'lxml')
        child_url_list = data.find_all(class_="cname")
        child_url_list = data.select('.cname>a')
        for j in range(0,2):
            child_url = child_url_list[j]['href']
            print(child_url)
            res_child = requests.get(child_url)
            print(res_child)
            child_data = bs(res_child.text, 'lxml')
            name = child_url_list[j].get_text()
            add  = child_data.select('.plist>ul>li')[0].find('span').get_text()
            add = add.replace(',', ' ')
            phno = child_data.select('.mcont>ul>li')[1].find('span').get_text()
            driver = wb.Chrome(executable_path=os.environ.get('CHROMEDRIVER_PATH'), chrome_options=chrmoe_opt)
            driver.get(child_url)
            try:
                email = driver.find_element(By.XPATH, '/html/body/table/tbody/tr/td[2]/div/div[4]/div[2]/ul/li[10]/span')
            except Exception as e:
                email = driver.find_element(By.XPATH, '/html/body/table/tbody/tr/td[2]/div/div[4]/div[2]/ul/li[8]/span')
            catag = child_data.select('.plist>ul>li')[3].get_text()
            catag = catag.split(':')[1]
            text = name + ', '+add+', '+phno+', '+email.text+', '+catag
            print(text)
            file.write(text)
            driver.close()
    else:
        print("Something went wrong")

file.close()