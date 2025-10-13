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

        print(f"Loaded {csv_file} with {len(df)} rows.")

    if dfs:
        combined_df = pd.concat(dfs, ignore_index=True)

        # Compute unique pair counts for BGP and CIDR (per month)
        bgp_pairs = combined_df.drop_duplicates(subset=['month', 'ipv4_prefix_bgp', 'ipv6_prefix_bgp']).groupby('month').size().rename('unique_bgp_pairs')
        cidr_pairs = combined_df.drop_duplicates(subset=['month', 'ipv4_prefix_cidr', 'ipv6_prefix_cidr']).groupby('month').size().rename('unique_cidr_pairs')

        monthly_agg = combined_df.groupby('month').agg({
            'jac_val_bgp': 'mean',
            'jac_val_cidr': 'mean',
        }).reset_index()

        monthly_agg = monthly_agg.merge(bgp_pairs.reset_index(), on='month', how='left').merge(cidr_pairs.reset_index(), on='month', how='left').fillna(0)

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
