# Eindproject proposal
#### Sofie Löhr (11038926)
Chosing your holiday destination includes a lot of variables, from whom the weather expectation is one. Can you see this coherence when visualizing the data?

## Problem statement
For countries tourism expenditures are a very important income source. In 2016 the 500 mln. tourists in Europe accounted for 342 dollar total (tourism receipts) (European Union Tourism Trends). However, this important source of income (tourism) depends partly on the unmanageable variable climate. How much does climate influence tourism in a country? Are there more tourists in a warm country? And do citizens stay more in their own country if the weather is good? 

## Solution
To show this coherence, I will visualize tourism and climate variables together. Since Europe has the most international tourists arrivals from all the continents in the world (European Union Tourism Trends), this is the area I will be focussing on. 

To visualize this relationship I will first show a bubble chart, with color intensity stating the temperature variable (for example average temperature) and size stating the tourism variable (for example arrivals at tourist accommodation establishments). Additional information when hovered will show next to it. 

This bubble chart will be interactive by chosing the YEAR. You can see an example sketch below. 

![bubble](doc/bubble_chart_example.png)

An additional (pop up) window when clicked on one of the (country) bubbles will have specific information about that country in the selected year. 
+ Line chart with dual axis (over time) of daily average temperature together with the tourism value to see the relationship over time per year. 
+ Piechart with the the tourism variable divided by country of residence: foreign or reporting country.

Below you can see an example sketch. 

![popup](doc/pop_up_window.png)

## Prerequisites

### Data Sources
##### Climate data from: 
+ [ecad](https://www.ecad.eu/dailydata/predefinedseries.php#)

##### Tourism data from:
+ [Eurostat](https://ec.europa.eu/eurostat/web/tourism/data/database)

### External Components
+ [D3](https://d3js.org/)
+ [D3-tip](https://github.com/Caged/d3-tip)
+ D3 legend
+ [Atom](atom.io)
+ [Sublime Text 2](https://www.sublimetext.com/2)

### Hardest parts
+ Arranging and combining the data in the right way, since the climate data has a difficult structure and is structured differently from the tourism data
+ Bubble chart implementation (if I have time I will implement moving bubbles when clicked)

## Reverences/simular visualizations
+ [Four Ways to Slice Obama’s 2013 Budget Proposal](https://archive.nytimes.com/www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html)
+ [D3 Bubble Chart](http://bl.ocks.org/phuonghuynh/54a2f97950feadb45b07)
+ [Dual axis line chart](https://bl.ocks.org/d3noob/814a2bcb3e7d8d8db74f36f77c8e6b7f)


[European Union Tourism Trends](https://www.e-unwto.org/doi/pdf/10.18111/9789284419470)