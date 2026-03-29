import csv
import random
from datetime import datetime, timedelta
import os

filename = "data.csv"
locations = ["낙동강", "한강", "금강"]

def generate_row(date, loc):
    water_temp = random.randint(24, 30)
    chlorophyll = random.randint(15, 60)
    oxygen = round(random.uniform(4.0, 7.5), 1)
    ph = round(random.uniform(7.2, 8.0), 1)
    return [
        date.strftime("%Y-%m-%d"),
        loc,
        water_temp,
        chlorophyll,
        oxygen,
        ph
    ]

# 2026-01-01 ~ 오늘 데이터 생성
def create_data_since_2026():
    start_date = datetime(2026, 1, 1)
    end_date = datetime.today()
    write_header = not os.path.exists(filename)

    with open(filename, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        if write_header:
            writer.writerow(["date","location","water_temp","chlorophyll","oxygen","pH"])
        current_date = start_date
        while current_date <= end_date:
            for loc in locations:
                writer.writerow(generate_row(current_date, loc))
            current_date += timedelta(days=1)
    print(f"{start_date.strftime('%Y-%m-%d')} ~ {end_date.strftime('%Y-%m-%d')} 데이터 생성 완료 ✅")

# 오늘 데이터만 추가 (매일 실행용)
def append_today_data():
    today = datetime.today().strftime("%Y-%m-%d")
    if os.path.exists(filename):
        with open(filename,"r",encoding="utf-8") as file:
            if today in file.read():
                print("오늘 데이터 이미 존재 → 추가 안함")
                return
    with open(filename, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        for loc in locations:
            writer.writerow(generate_row(datetime.today(), loc))
    print("오늘 데이터 추가 완료 ✅")

# 실행
create_data_since_2026()
append_today_data()
