# Sofie Löhr
# student number: 11038926
"""
Script to sort and calculate differences
"""
import pandas as pd
import sys
import os

# inladen data
# file_name = 
# data = pd.read_csv('../Outputs/ECA_blend_tg/' + file_name, index_col=0)


# inladen data
directory_in_str = '../../data/ECA_blend_tg/'
directory = os.fsencode(directory_in_str)

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".txt"): 
        print(os.path.join(directory, filename))
    else:
        print('hoi')