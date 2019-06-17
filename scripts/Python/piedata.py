# Sofie Löhr
# student number: 11038926
"""
Script to sort and calculate differences
"""
import pandas as pd
import numpy as np
import sys
import os

INPUT_FILE_1 = 'tour_dem_ttw_1_Data.csv'
# INPUT_FILE_2 = 'tour_dem_ttw_1_Data.csv'
OUTPUT_FILE = 'pie_data.json'

def process(data):
	

	# only use total arrivals, number, and all accomodations
	data = data[data['DURATION'] == '1 night or over']
	data = data[data['PURPOSE'] == 'Total']
	data = data[data['UNIT'] == 'Number']

	# only use the columns GEO and Value
	data = data[['TIME', 'GEO', 'Value', 'PARTNER']]

	# make Values from string to int
	def clean(x):
		x = x.replace(' ', '')
		if not x == ':':
			x = int(x)
		elif x == ':':
			x = np.nan
		return x

	data['Value'] = data['Value'].apply(clean)

	print(data)

	return data


if __name__ == "__main__":
	
	# load data
	data = pd.read_csv('../../data/tour_dem_ttw/' + INPUT_FILE_1)

	data = process(data)

	# export to json
	export = data.to_json('../../data/' + OUTPUT_FILE, orient='records')


