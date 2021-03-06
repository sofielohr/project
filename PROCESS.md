# Process
#### Sofie Löhr (11038926)

### Day 1
Today I almost finished the proposal and design document. My selected data was not competible with the idea I had so I had to find new data. Instead of number of trips as bubble and line chart variable I will use number of tourist arrivals at establishments. Also instead of 2 seperate figures for the year distribution of tourism and temperature I will now combine these in a dual axis to show the relationsship better.

### Day 2
Today I made the final dessicions for the proposal and design document:
+ Instead of a dropdown for the temperature variable in the linechart I will use a dropdown for the subject of the piechart, since this makes more sence regarding my sub question: do tourists of warm countries stay in their countries more.

Also I began making my homepage by chosing the bootstrap template and implementing my own pages (homepage, visualization, information) and some titles.

### Day 3 
I processed a part of the tourism data in python. I decided to not transform my data to a ready to use JSON in python but to alter it a bit in javascript aswel, so I can combine it with the temperature data. The structure I will be making will start with a year object, then as value the countries objects with the needed data inside.

### Day 4
During the standup I got the tip to search the internet a bit more for the average temperature values, since my data has a very complicated structure, and we suspected that somewhere on the internet there will be a dataset with the information I need which is easier to use. 

### Day 5
I tried to search voor datasets with average temperature in an easier way to process, but could not find any reliable one. I started processing the data by looping over all the files and calculating the average. I still have to combine the different weather stations by country using the stations.txt file. 

### Day 6
In de standup kreeg ik een tip om niet met loops de station data aan de countries te koppelen maar dit met merge functie van pandas te doen, die ik zelf nog nooit had gebruikt. Dit gaat veel sneller wat erg handig is voor de grootte van de dataset die ik heb.

Ik ben halverwege de dag ziek geworden en ben heb daarna 2 dagen ziek op bed gelegen. Ik zal dit in het weekend inhalen.

### Day 7
Today I implemented the bubble chart and I decided to use a time slider as interactive element. The climate colors are not yet implemented but I first have to process that data a bit more (it's very difficult). Since we have to finish the alpha version this week and I have missed 2.5 days, I first focussed on the graphs I could do without the climate data (like the bubble chart). 

### Day 8
Everytime I processed the data for a graph, I found out the format of the data has to be in a special way to implement the graph. For example for the bubble chart you had to specify children and put the data in a list. For the dual axis line chart I'm still trying to find out what they do in the example and how I can implement this in the best way to also link the figures. I think this is a difficult part of the implementation and it takes me a bit longer than expected. 

### Day 9
Today I programmed all my graphs. At the end of the day I found out that the processing of the data for the line graph (tourism variable) did not go right. The values of all the months in one year are the same so the line is straight. Also the piechart data has to be formatted differently to make the circle work, so both these things I have to fix tomorrow. Since I struggled with my data a lot, I got a tip in the standup from Maria that I should implement exactly the graph from the example (with their data) first and make it work. This way you can see how they give the data to the graph (with console.log) and format the data in the same way. 

### Day 10
All the graphs are (almost) the way they should be now. The only thing I still have to implement is the linked views. I started with this but I don't really get how you can give the line and pie data (and right year/country) to the function that makes the line and pie chart inside the on("click"). I also made the bubble chart move when it updates to another country. I want a country to move to another place when the year is updated instead of going away and coming back with the new value. I don't know why this is not working because I think it is sort of implemented in the script. 

### Day 11
I implemented the linked views but it's not in a pretty way now. First the timeslider gets made and fromn there the bubblechart is made (which also gets all the data). Then the other 2 graphs are made in main, but updated in the bubble chart. All the updating is now done by deleting and adding, so this has to be changed. Also I found out the color function is not working as it should be because the colors are not getting more red (warmer) when the temperature is higher so I have to figure out where this is going wrong. I added a screenshot of the site at this moment. 

![screen1](doc/update1.png)
![screen2](doc/update2.png) 

#### Day 12
I Implemented the update functions for the bubble chart and line chart but not correct yet. The bubble chart is now updating on top off the old bubble chart. I also added the legend for the size of the bubbles but not much else because I spend a lot of time on understanding the updates. 

#### Day 13
I figured out why the bubble chart was not updating: I was selecting and naming the wrong names so it did not remove or join. Also I added the update for the line chart axis and the update for the piechart, but this is not right yet. When clicking on a country, the chart updates to the default value "incoming", also when it's set to "outgoing". I tried to always set the tickbox to the default setting when updating but this is not working yet. 

#### Day 14
For the bubble chart I use the reverse function (for color) because the color scheme is from red to blue instead of the other way around. I thought this worked but today I found out the colors are (in my opinion randomly) switching from the reverse to the not reverse. For example: If I change the year to 2013 it works, then 2014 again correct but back to 2013 all the ‘hot’ countries are suddenly blue instead of red. I fixed this by manually setting the colors in an array. The updates are working correctly now.

#### Day 15
The tooltips were not working correctly, I only showed the country name but not the values. I fixed this (with help) after putting it inside a 'foreignObject' so javascript recognizes as a html. This way it works for all the graphs. Also I made final touches to my site. Also I added dots for the line chart. 

#### Day 16
I editted the update a bit to make the transitions prettier when there is no data. Also I added a text block that shows the chosen year and country for the pie and linechart. The final version looks like this. 

![page1](doc/page1.png) 
![page1](doc/page2.png) 
![info_sheet](doc/info_sheet.png) 



