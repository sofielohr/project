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
OUTPUT_FILE = 'tourism_data.json'
OUTPUT_FILE_YEAR = 'tourism_year_data.json'

def process_pie(data):
	
	# only use total arrivals, number, and all accomodations
	data = data[data['C_RESID'] != 'Total']
	data = data[data['UNIT'] == 'Number']
	data = data[data['NACE_R2'] == 'Hotels; holiday and other short-stay accommodation; camping grounds, recreational vehicle parks and trailer parks']

	# only use the columns GEO and Value
	data = data[['Value', 'TIME', 'GEO', 'C_RESID']]

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
	data['Year'] = data['TIME'].str[0:4].astype(int)
	data = data[data['Year'] < 2019]
	data['Month'] = data['TIME'].str[5:7].astype(int)

	data_year = year_data(data)

	# delete the EU values
	data_year = data_year[data_year['GEO'] != 'European Union - 28 countries']
	data_year = data_year[data_year['GEO'] != 'European Union - 27 countries (2007-2013)']
	data_year = data_year[data_year['GEO'] != 'Euro area (EA11-2000, EA12-2006, EA13-2007, EA15-2008, EA16-2010, EA17-2013, EA18-2014, EA19)']

	return data_year

def process(data):
	
	# only use total arrivals, number, and all accomodations
	data = data[data['C_RESID'] == 'Total']
	data = data[data['UNIT'] == 'Number']
	data = data[data['NACE_R2'] == 'Hotels; holiday and other short-stay accommodation; camping grounds, recreational vehicle parks and trailer parks']

	# only use the columns GEO and Value
	data = data[['Value', 'TIME', 'GEO']]

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
	data['Year'] = data['TIME'].str[0:4].astype(int)
	data = data[data['Year'] < 2019]
	data['Month'] = data['TIME'].str[5:7].astype(int)

	data_year = year_data(data)

	# delete the EU values
	data_year = data_year[data_year['GEO'] != 'European Union - 28 countries']
	data_year = data_year[data_year['GEO'] != 'European Union - 27 countries (2007-2013)']
	data_year = data_year[data_year['GEO'] != 'Euro area (EA11-2000, EA12-2006, EA13-2007, EA15-2008, EA16-2010, EA17-2013, EA18-2014, EA19)']
	data_year.loc[data_year['GEO'] == 'Germany (until 1990 former territory of the FRG)', 'GEO'] = 'Germany'

	return data, data_year

def year_data(data):
	# calculate year average
	temp = pd.DataFrame()
	
	for jaar in data['Year'].unique():
		for land in data['GEO'].unique():
			jaar_data = data[data['Year'] == jaar]
			land_data = jaar_data[jaar_data['GEO'] == land]
			land_data['Average'] = land_data['Value'].mean()/10
			temp = pd.concat([temp,land_data['Average']], axis=0)

	data['Average'] = temp
	data = data[data['Month'] == 1]

	# delete columns 'Day', 'Q_TG', 'SOUID', 'YearMonth' and 'TG'
	data = data.drop(labels=['TIME', 'Month', 'Value'], axis=1)

	return data

def year_data_pie(data):
	# calculate year average
	temp = pd.DataFrame()
	
	for jaar in data['Year'].unique():
		for land in data['GEO'].unique():
			for resid in data['C_RESID'].unique():
				jaar_data = data[data['Year'] == jaar]
				land_data = jaar_data[jaar_data['GEO'] == land]
				resid_data = land_data[land_data['C_RESID'] == resid]
				resid_data['Average'] = resid_data['Value'].mean()/10
				temp = pd.concat([temp,resid_data['Average']], axis=0)

	data['Average'] = temp
	data = data[data['Month'] == 1]

	# delete columns 'Day', 'Q_TG', 'SOUID', 'YearMonth' and 'TG'
	data = data.drop(labels=['TIME', 'Month', 'Value'], axis=1)

	return data


if __name__ == "__main__":
	
	# load data
	data = pd.read_csv('../../data/tour_occ_arm/' + INPUT_FILE)

	data, data_year = process(data)

	print(data)
	print(data_year)

	# export to json
	# export = data.to_json('../../data/' + OUTPUT_FILE, orient='records')
	export = data_year.to_json('../../data/' + OUTPUT_FILE_YEAR, orient='records')


