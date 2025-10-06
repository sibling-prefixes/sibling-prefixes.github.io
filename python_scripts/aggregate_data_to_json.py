import os
import json
import pandas as pd
import datetime as dt

DATA_DIR = '../data/csvs/'

def load_and_aggregate_data():
    dfs = []
    csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]

    for csv_file in csv_files:
        # Extract the date part (first 8 characters before the first '_')
        date_str = csv_file.split('_')[0]  # e.g., '20240904'
        
        # Convert to datetime object (assuming YYYYMMDD format)
        date_obj = dt.datetime.strptime(date_str, '%Y%m%d')
        
        timestamp = int(date_obj.timestamp())

        df = pd.read_csv(os.path.join(DATA_DIR, csv_file))
        df['timestamp'] = timestamp
        df['date'] = pd.to_datetime(df['timestamp'], unit='s')
        df['month'] = df['date'].dt.to_period('M').astype(str)

        dfs.append(df)

        print(f"Loaded {csv_file} with {len(df)} unique rows.")

    if dfs:
        combined_df = pd.concat(dfs, ignore_index=True)
        # print("Rows per month in combined_df (before deduplication):")
        # print(combined_df.groupby('month').size())

        # Remove duplicates pairs of ipv4_prefix_bgp, and ipv6_prefix_bgp by month
        combined_df = combined_df.drop_duplicates(subset=['month', 'ipv4_prefix_bgp', 'ipv6_prefix_bgp'])

        # print("Rows per month in combined_df (after deduplication):")
        # print(combined_df.groupby('month').size())

        # Aggregate by month
        monthly_agg = combined_df.groupby('month').agg({
            'jac_val_bgp': 'mean',
            'jac_val_cidr': 'mean',
            'ipv4_prefix_bgp': 'count'
        }).reset_index()

        return monthly_agg.to_dict('records')
    return []

if __name__ == '__main__':
    aggregated_data = load_and_aggregate_data()
    output_dir = '../data/jsons/'
    output_file = os.path.join(output_dir, 'monthly_aggregated_data.json')

    # Ensure the directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Save to JSON file
    with open(output_file, 'w') as f:
        json.dump(aggregated_data, f, indent=4)

    print(f"Aggregated data saved to {output_file}")