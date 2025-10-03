import csv
from .extraction import calculate_main

# Specify the CSV file name
csv_file = "output.csv"

# Grab data...
data, _ = calculate_main(54.97400525015693, -1.6298853388907608)

# Write list (of dictionaries) to CSV
if data:
    fieldnames = sorted(list(data[0].keys()))
else:
    fieldnames = []

with open(csv_file, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(data)

print("CSV file created successfully.")