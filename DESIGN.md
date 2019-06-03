# Design Document
#### Sofie Löhr (11038926)


## Datasource:
##### Climate data from: 
+ [ecad](https://www.ecad.eu/dailydata/predefinedseries.php#)

##### Tourism data from:
+ [Eurostat](https://ec.europa.eu/eurostat/web/tourism/data/database)

### Process the data
First I need to process the input files from tourism and climate seperately. Then I have to combine the sets and then convert it to JSON for easy to use in javascript. This will all be done in python.

##### Process tourism input files
To process the tourism input files I have to add the country codes to the data.

##### Process climate input files
This data comes in different txt files per weather station by station ID (downloadable per temperature variable) so these have to be combined into one big file. This file will have (at least) the following variables:
+ Country
+ Weather station
+ Average temperature
+ Date

To combine these seperate files I have to load all the files and combine them per country by using the stations.txt file. Also it is very important to make the dictionaries as easy to use as possible (like the average tempereture for a specific year (bubble chart) and values per month (line chart)). To make the temperature values easy to use, they have to be made into month or year values and instead of per 0.1 degree celsius, I will transfrom them in degrees celsius with 1 decimal. 

## Diagram of the technical components
In the bubble chart, the relationship between temperature and tourism will be visible. By hovering on a (country) bubble, the specifics of that country will become visible in a small infosheet. By clicking on the (country) bubble a (pop up) window will give specific information about that country in the selected year. This will be done by a piechart/barchart/linechart of the tourism variable per month. To see the temperature behaviour in the selected year I will make a line chart (Steam map) with the minimal, maximal and average temperature (by day/month) for the specific country.

![sketch](doc/technical_components.png)

This will be done by a piechart/barchart/linechart of the tourism variable per month. To see the temperature behaviour in the selected year I will make a line chart (Steam map) with the minimal, maximal and average temperature (by day/month) for the specific country.

##### Bubble Chart


##### Pie Chart

##### Line Chart



## D3 plugins


![sketch](doc/simple_bubble_chart.png)