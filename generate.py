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

# 🔥 1년 데이터 생성
def create_initial_data():
    if os.path.exists(filename):
        print("이미 data.csv 존재 → 초기 생성 스킵")
        return

    start_date = datetime.today() - timedelta(days=365)

    with open(filename, "w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["date", "location", "water_temp", "chlorophyll", "oxygen", "pH"])

        for i in range(365):
            current_date = start_date + timedelta(days=i)

            for loc in locations:
                writer.writerow(generate_row(current_date, loc))

    print("1년치 데이터 생성 완료 ✅")

# 🔥 마지막 줄 개행 보정 함수 (핵심 추가)
def ensure_newline():
    if not os.path.exists(filename):
        return

    with open(filename, "rb+") as file:
        file.seek(-1, os.SEEK_END)
        last_char = file.read(1)

        if last_char != b"\n":
            file.write(b"\n")

# 🔥 오늘 데이터 추가
def append_today_data():
    today = datetime.today().strftime("%Y-%m-%d")

    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as file:
            if today in file.read():
                print("오늘 데이터 이미 존재 → 추가 안함")
                return

    # 👉 추가 전에 줄바꿈 보정
    ensure_newline()

    with open(filename, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        for loc in locations:
            writer.writerow(generate_row(datetime.today(), loc))

    print("오늘 데이터 추가 완료 ✅")

# 실행
create_initial_data()
append_today_data()
