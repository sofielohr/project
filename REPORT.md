# Final Report
Sofie Löhr (11038926)

## Description
This website shows the relationship between climate (temperature) and tourism. In the bubblechart this relationship is shown by the size and colors of the bubbles. The size of the bubbles represents the number of tourists per country and the color represents the average temperature per country, both in the chosen year. In the slider you can chose a year. If you want to see this relationship during the chosen year for a country, you can click one of the bubbles and then the line chart shows the temperature and tourists over the year. The piechart also updates when a country is clicked. This piechart shows the origin of the incoming tourist (when 'incoming' is clicked): Foreign or Reporting country. When 'outgoing' is clicked, the trip destination of the chosen country's residents is shown: Domestic or Outbound. 

![page1](doc/page1.png) 
![page1](doc/page2.png) 

## Technical design
The website exsists of 2 pages (html): the index (visualization) page and the information page. The index.html imports all the javascript files to actually make the visualizations. 

The navigation and creation of the graphs is as follows: when the page is loaded, main.js runs. In this file the data for the graphs is processed to the right javascript format with functions process (bubblechart.js), line_data (linechart.js), piechart_data (piechart.js) and then the slider (bubblechart.js) is made. In the slider function, the default bubble chart (with it's color legend) is created by calling the function bubble. Then in main, the circle legend of the bubblechart and both the linechart and piechart are created. 

Updating the graph when changing the year in the slider is done with the function redraw (bubblechart.js). When a country bubble is clicked, the linechart and piechart are updated (from redraw) with update_line (linechart.js) and update_pie (piechart.js). Inside update_pie is the function interactive_pie. This function updates the piechart when the radio button input changes (incoming-outgoing). Note: when updating the piechart because of a country change, the piechart (and radio button) is set to incoming.

A more detailed description of all the functions is given in Components. 

## Components
### index.html and information.html
+ The index.html file contains all the javascript files and the external imports (like D3). The information file contains the info in html.

### Python
Since processing my data was a bit complicated, I will shortly describe the steps I made in the files. 

#### process_tourism.py
+ This file loads the input file (tour_occ_arm_1_Data.csv) into a pandas dataframe. Then the functions process and process_pie delete unnecessary rows and columns and the data is formatted. The function can respectively be used for the bubble and line data or the pie data. For the bubble and pie data, the function year_data is used to make yearly data from the month data. Then it converts to json. 

#### piedata.py
+ This script only deleted unnecessary rows and columns and formats the data (tour_dem_ttw_1_Data) in the right way. This data is the 'outgoing' data for the piechart and is already yearly data. Last, it converts to json.

#### process_climate.py
+ This file loads and processes the temperature data. The data from Ecad comes in a folder with 4 types of txt files. First a file stations.txt with a table of all the weather stations (codes), the corresponding country code and some other variables. Then there are over 4000 files of all the daily average temperature of the different weather stations. The other two files elements.txt and sources.txt will not be used. 

+ The file loops over all the files, skipping elements.txt and sources.txt, processing the weather station files and loading the stations file. The individual weather station files are first formatted (also adding/deleting rows/columns), then made into monthly data (from daily) and then combined to the total data file. 

+ The total datafile is then processed as follows:
	+ The file is merged with the stations dataframe so the country codes can be used.
	+ Then the individual weather station data is combined per country.
	+ The country names (from country_names.csv) are added.
	+ Another dataframe with yearly data is made.
	+ Both the dataframes are converted to json.


### Javascript

#### main.js
+ The file main.js is described before in the general overview.

#### bubblechart.js
+ This file contains the functions process, which processes the tourism and climate data by going over the imported data (both climate and tourism) and adding it to the dataset. The structure of the dataset is an Object with as keys the year and the values another Object. In this object the keys are the country names and the values again another Object with the variables per country.

+ The next function is the function bubble which formats the data in the specific format for a bubble chart and creates the bubble chart (for the first time) and the color legend by calling respectively redraw (outside the function bubble) and color_legend (inside the function bubble).

+ The color_legend function creates the color legend.

+ The slider function creates the slider, calls the bubble function for the first time and again calls the redraw function when the slider is used to change the country.

+ The circle_legend function creates the circle legend.

+ The function redraw updates the bubble chart every time the slider time is changed. First it selects and joins the data, then it exits and removes old bubbles, then it updates and then it creates the new values. Also the stroke and tooltip when mouseover are created. In this function the updating of the line and piechart is done by the .on("click"), calling the functions update_line (linechart.js), update_pie (piechart.js) and update_text (linechart.js). 

#### linechart.js
+ The file starts with the function line_data to process the data. This is done in a similar way as in the bubblechart.js file by going over the import files and creating a dataset with the same structure. 

+ In the function line the whole linechart is made, including tooltips, axis, title etc. The data is formatted a little bit differently so making the linechart is easier. Also a text to show which country and year is made in this function. This function is called only once in main.js. 

+ For updating we use the function update_line. Here, the linechart is updated in a similar way as the redraw function. Also the line and dot update is specified differently for countries with no temperature data in the specified year that are clicked. This function is called in the .on("click") in the redraw function every time a country is clicked. 

+ Lastly, the update_text function is also called at this moment to update the text that shows the chosen country and year. 

#### piechart.js
+ In this file again the data is processed in a similar way as the previous process functions. Only the dataset is sturctured a bit differently so the switch between the piecharts is easy. 

+ Then the piechart function makes the piechart and calls the update_pie function to create the piechart the first time. 

+ The update_pie function is called when a country is clicked to update the piecharts. Inside this funtion is the interactive_pie function which is called when the radio buttons is changed. Every time the update_pie function is called (from the click on a country), the piechart is set to the option 'incoming'. 

## Challenges

+ A big challenge for me was de data. First, processing the data in python took longer than expected because of the difficult structure of the climate data. The files had to be combined from different files and afterwards they had to be modified a lot. 

+ Also in javascript, I first wrote the process scripts with somewhat the same structure for all the graphs. When implementing the graphs, I everytime found out the structure I used was not compatible with the example format I used for the graph. After a while I got a tip in the standup to first implement the graphs exactly the same way as the examples so you could replicate that. 

+ Another challenge, especially in the end, was because of my way of working. Because after I implemented one of the graphs in the most simple way, I continued to the next graph without making it the exact way I wanted. So in the last weeks I had to add and change a lot in the graphs to, for example, make the bubble chart moving and interactive. Also things like legends and adding colors had to be done still, which were suddanly a bit harder than expected, resulting in more work and debugging than I expected. For example, the colors of the bubble chart (an important part of my visualization) depended on the temperature data. First, I had to add the temperature data to the existing data used in the bubble chart and then also make the color scale function. Even when I implemented something I was happy about, I fount out after a couple of days this was not even working right and the color scale reversed randomly. In the end I just used a threshold with a manually added color range. 

#### Changes
Changes regarding the design document aren't that much. I'm very happy with the graphs I chose. Especially the bubble chart, which I think worked out really pretty. The only thing I did not implement was the pop up screen for the 2 graphs. This was because of a tip I got to put the graphs on the same screen for more clearness. 

This is also the reason I think it's good I did not implement the pop up screen. The things I wish I had done differently are the ones I struggled with the most. I wish I chosen an easier dataset, beforehand explored the datastructure of the example better and implemented the graphs completely with all (or most) of it's features before moving on. 
