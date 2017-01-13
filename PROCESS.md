# day 1

I created my first proposal and sketches for my project.

![Sketches](doc/Sketch_1.jpeg)
![Sketches](doc/Sketch_2.jpeg)

# day 2  

Today I decided to change the focus of my story slightly. Instead of immediately showing a map of The Netherlands, I start out with a world map. This is to provide context to the problem of depression worldwide and to be able to see how depression rates in The Netherlands measure up to the rest of the world.

I have made a new sketch to visualize this idea, which includes the new world map at the top of the page. I also updated my README to include these new changes.  

![New sketch](doc/sketch-3.jpg)

# day 3

I gathered data for the world map (showing suicide rates and depression rates), and made a request
for data with Monitor Volksgezondheid. I decided to change the graph next to the map of the Netherlands, because I can't find data for the cost of health care in each region. Instead, I want
to look at usage of mental health care/the number of mental health care providers in each region.

During the morning stand-up I got the feedback that it should be clear which graphs are linked to each other (especially with the map of the Netherlands). With this in mind, I decided to change some of the visualizations I had in mind.

Instead of a bar chart next to my map, I now will have a sorted table, and my donut chart will be replaced by a line graph to show the costs of mental health care in the Netherlands throughout the last 10 years.  

I made new sketches:
![Sketch](doc/sketch netherlands.jpeg)

![Sketch](doc/sketch-bar-chart.jpeg)

I started coding, I now have a basic layout for my website (which is not functional yet.)

![First layout](doc/first-layout-1.png)![First layout](doc/first-layout-2.png)

# day 4

My focus today was on creating a basic layout/format for my website, so I can create the interactive visualizations as soon as I have all the data. I now have the layout with the text and the different maps, I just have to add the line graph and bar chart. I also formatted the data of suicide rates in the World, which I can already use for my visualizations now.

![Second layout](doc/second-layout1.png)
![Second layout](doc/second-layout2.png)
![Second layout](doc/second-layout3.png)
![Second layout](doc/second-layout4.png)
![Second layout](doc/second-layout5.png)

The search function with the table is already functional, but the data I used now is the world suicide rates. I spent some time researching different layout options and using it to improve the structure of the site.

# day 5

I changed my idea of a line graph to a scatterplot, so I can show the relation between the costs spent on mental health care and the depression/suicide rates in different years. After presenting my project to the group, I got feedback on exploring the relation to suicide rates and depression in my scatterplot. Now this is not necessarily shown clearly in my map of The Netherlands.

From someone else from the group, I am going to get a topojson map of The Netherlands, which I can use instead of my SVG-map. This will allow me to use D3 datamaps with my map of the The Netherlands as well.

In regards to the website, I added the suicide data I already imported to the world map and created a color scale for this and the legend.

![World map suicide rates](doc/world-map-suicide.png)

Before Monday, I plan to have formatted all my data so I can create my visualizations and have them all working with the right data. 
