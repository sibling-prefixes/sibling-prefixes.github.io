import pandas as pd

df = pd.read_csv('../data/latest/20251008_down_08_28_48.csv')

columns_to_keep = [
    'ipv4_prefix_bgp',
    'ipv6_prefix_bgp',
    'ipv4_prefix_cidr',
    'ipv6_prefix_cidr'
]
df_filtered = df[columns_to_keep]

df_filtered.to_csv('../data/latest/20251008_down_08_28_48_edited.csv', index=False)