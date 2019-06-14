# Sofie Löhr
# student number: 11038926
"""
Script to sort and calculate differences
"""
import pandas as pd
import numpy as np
import sys
import os

INPUT_FILE = 'tour_occ_arm_1_Data.csv'
OUTPUT_FILE = 'tourism_year_data.json'

def process(data):
	
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
		elif x == ':':
			x = np.nan
		return x

	data['Value'] = data['Value'].apply(clean)

	# make Year column
	data['Year'] = data['TIME'].str[0:4]
	data['Month'] = data['TIME'].str[5:7]

	# calculate year average
	temp = pd.DataFrame()
	
	for jaar in data['Year'].unique():
		for land in data['GEO'].unique():
			jaar_data = data[data['Year'] == jaar]
			land_data = jaar_data[jaar_data['GEO'] == land]
			land_data['Average'] = land_data['Value'].mean()/10
			temp = pd.concat([temp,land_data['Average']], axis=0)

	data['Average'] = temp
	data = data[data['Month'] == '01']

	# delete columns 'Day', 'Q_TG', 'SOUID', 'YearMonth' and 'TG'
	data = data.drop(labels=['TIME', 'Month'], axis=1)

	return (data)



if __name__ == "__main__":
	
	# load data
	data = pd.read_csv('../../data/tour_occ_arm/' + INPUT_FILE)

	data = process(data)

	# export to json
	export = data.to_json('../../data/' + OUTPUT_FILE, orient='records')


