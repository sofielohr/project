# Sofie Löhr
# student number: 11038926
"""
Script to sort and calculate differences
"""
import pandas as pd
import sys
import os

def load_data():

	directory = '../../data/ECA_blend_tg1/'
	count = 0

	for file in os.listdir(directory):
		filename = os.fsdecode(file)
		print(filename)
		if filename == 'stations.txt':
			path = os.path.join(directory, filename)
			data = pd.read_csv(path, skiprows=[i for i in range(16)], sep=',', skipinitialspace=True)

		elif filename == 'elements.txt' or filename == 'sources.txt':
			continue
		else:
			path = os.path.join(directory, filename)
			data = pd.read_csv(path, skiprows=[i for i in range(20)], sep=',', skipinitialspace=True)

			# process the weather station file
			data = process_file(data)
			
			# check if not dataframe empty (no values after 2009)
			if not data.empty:



	return data



def process_file(data):

	# make year & month column and delete values before 2010
	data['Year'] = data['DATE'].astype(str).str[0:4]
	data['Month'] = data['DATE'].astype(str).str[4:6]
	data['YearMonth'] = data['DATE'].astype(str).str[0:6]
	data = data[data['Year'].astype(int) > 2009]
	
	# delete missing values
	data = data[data['Q_TG'] != 9]
	return data




if __name__ == "__main__":
	
	# load data
	data = load_data()

	# export to json
	# export = data.to_json('../../data/' + OUTPUT_FILE, orient='records')
