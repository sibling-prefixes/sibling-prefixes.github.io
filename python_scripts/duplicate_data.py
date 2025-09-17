import os
import shutil
import random
from datetime import datetime, timedelta
import argparse

def random_date(start, end):
    delta = end - start
    random_days = random.randint(0, delta.days)
    return start + timedelta(days=random_days)

if __name__ == "__main__":

    parser = argparse.ArgumentParser(description="Duplicate CSV files with random dates.")
    parser.add_argument('num_duplicates', type=int, help="Number of duplicate files to create")
    
    args = parser.parse_args()
    num_duplicates = args.num_duplicates

    original_file = 'data/csvs/20240904_08_28_96_max_jac_dmn_as_cntry_pyasn_org_edited.csv'

    start_date = datetime(2023, 9, 13)
    end_date = datetime(2024, 9, 11)

    used_dates = set()

    original_date_str = '20240904'
    used_dates.add(original_date_str)

    for i in range(num_duplicates):
        random_dt = None
        date_str = None
        
        while True:
            random_dt = random_date(start_date, end_date)
            date_str = random_dt.strftime('%Y%m%d')
            if date_str not in used_dates:
                used_dates.add(date_str)
                break
        
        new_filename = original_file.replace('20240904', date_str)
        
        shutil.copy(original_file, new_filename)
        print(f"Created: {new_filename}")

    print(f"Duplication complete. Created {num_duplicates} unique files.")
