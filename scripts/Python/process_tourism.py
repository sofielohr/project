# Sofie Löhr
# student number: 11038926
"""
Script to sort and calculate differences
"""
import pandas as pd
import sys
import os

INPUT_FILE = 'tour_occ_arm_1_Data.csv'
OUTPUT_FILE = 'tourism_data.json'

# load data
data = pd.read_csv('../../data/tour_occ_arm/' + INPUT_FILE)

# only use total arrivals, number, and all accomodations
data = data[data['C_RESID'] == 'Total']
data = data[data['UNIT'] == 'Number']
data = data[data['NACE_R2'] == 'Hotels; holiday and other short-stay accommodation; camping grounds, recreational vehicle parks and trailer parks']

# only use the columns GEO and Value
data = data[['TIME', 'GEO', 'Value']]

# make Values from string to int
def clean(x):
    x = x.replace(' ', '')
    if not x == ':':
    	x = int(x)
    return x

data['Value'] = data['Value'].apply(clean)

# make Year column
data['Year'] = data['TIME'].str[0:4]

print(data)

# export to json
# export = data.to_json('../../data/' + OUTPUT_FILE, orient='records')



