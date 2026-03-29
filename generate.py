import csv, random
from datetime import datetime, timedelta

locations = ["낙동강","한강","금강"]
filename = "data.csv"

start_date = datetime(2026,1,1)
end_date = datetime.today()

with open(filename,"w",newline="",encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["date","location","water_temp","chlorophyll","oxygen","pH"])
    current = start_date
    while current<=end_date:
        for loc in locations:
            writer.writerow([
                current.strftime("%Y-%m-%d"),
                loc,
                random.randint(24,30),
                random.randint(15,60),
                round(random.uniform(4.0,7.5),1),
                round(random.uniform(7.2,8.0),1)
            ])
        current += timedelta(days=1)
