# Sofie Löhr
# student number: 11038926
"""
Script to sort and calculate differences
"""
import pandas as pd
import sys
import os

OUTPUT_FILE = 'climate_data.json'
OUTPUT_FILE_YEAR = 'climate_year_data.json'


def load_data():

	directory = '../../data/ECA_blend_tg/'
	
	data_complete = pd.DataFrame()
	count = 0

	for file in os.listdir(directory):
		filename = os.fsdecode(file)
		count += 1
		print(filename)
		print(count)
		if filename == 'stations.txt':
			path = os.path.join(directory, filename)
			stations = pd.read_csv(path, skiprows=[i for i in range(16)], sep=',', skipinitialspace=True)
			stations = stations.drop(labels=['STANAME                                 ', 'LAT', 'LON', 'HGHT'], axis=1)

		elif filename == 'elements.txt' or filename == 'sources.txt':
			continue
		else:
			path = os.path.join(directory, filename)
			data = pd.read_csv(path, skiprows=[i for i in range(20)], sep=',', skipinitialspace=True)

			# process the weather station file
			data = process_file(data)
			
			# check if not dataframe empty (no values after 2009)
			if not data.empty:

				# calculate the average per month and only keep 1 row per month (instead of 28/30/31)
				data = calculations(data)

				# add data to the complete dataset
				data_complete = data_complete.append(data)
			
	# add station data to country data
	data_complete = pd.merge(data_complete, stations, on='STAID', how='left')

	# calculate per country the average of the different weather stations
	data_complete = combine_countries(data_complete)

	# add country name
	data_complete = country_name(data_complete)

	# process 
	data_complete['Year'] = data_complete['YearMonth'].str[0:4].astype(int)
	data_complete['Month'] = data_complete['YearMonth'].str[4:6].astype(int)

	# create yearly data
	data_complete_year = yearly(data_complete)

	return data_complete, data_complete_year


def process_file(data):

	# make year & month column and delete values before 2010
	data['Year'] = data['DATE'].astype(str).str[0:4]
	data['Day'] = data['DATE'].astype(str).str[6:8]
	data['YearMonth'] = data['DATE'].astype(str).str[0:6]
	
	data = data[data['Year'].astype(int) > 2009]
	
	# delete missing values
	data = data[data['Q_TG'] != 9]
	return data

def calculations(data):
	temp = pd.DataFrame()
	
	for maand in data['YearMonth'].unique():
		
		maand_data = data[data['YearMonth'] == maand]
		maand_data['Average'] = maand_data['TG'].mean()/10
		temp = pd.concat([temp,maand_data['Average']], axis=0)

	data['Average'] = temp
	data = data[data['Day'] == '01']

	# delete columns 'Day', 'Q_TG', 'SOUID', 'YearMonth' and 'TG'
	data = data.drop(labels=['Day', 'Q_TG', 'SOUID', 'TG'], axis=1)	

	return data

def yearly(data):
	temp = pd.DataFrame()
	
	for jaar in data['Year'].unique():
		for land in data['CN'].unique():
			jaar_data = data[data['Year'] == jaar]
			land_data = jaar_data[jaar_data['CN'] == land]
			land_data['Average'] = land_data['Average'].mean()
			temp = pd.concat([temp,land_data['Average']], axis=0)

	data['Average'] = temp
	data = data[data['Month'] == 1]

	# delete columns 'Day', 'Q_TG', 'SOUID', 'YearMonth' and 'TG'
	data = data.drop(labels=['Month', 'YearMonth'], axis=1)

	return data

def combine_countries(data_complete):
	
	data_complete = data_complete.groupby(['CN', 'YearMonth']).mean()[['Average']]
	# data_complete['Country_Average'] = data_complete[['Average']].mean(axis=1)
	data_complete = data_complete.reset_index()

	return data_complete

def country_name(data_complete):

	countries = pd.read_csv('../../data/country_names.csv', sep=',')
	countries = countries.rename(columns={'Code':'CN'})
	
	data_complete = pd.merge(data_complete, countries, on='CN', how='left')

	return data_complete


if __name__ == "__main__":
	
	# load data
	data_complete, data_complete_year = load_data()

	# export to json
	# export = data_complete.to_json('../../data/' + OUTPUT_FILE, orient='records')
	# export = data_complete_year.to_json('../../data/' + OUTPUT_FILE_YEAR, orient='records')



