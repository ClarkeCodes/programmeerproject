# Report

Eline Jacobse  
1612335

## Description

In my project I look at depression and suicide around the world. The goal is to create awareness of depression, and show more people in what countries people are depressed, what the demographics of the people who are depressed are, and how this has changed over the past ten years.

Subject, intended audience, goal, etc.
Start with a short description of your application (like in the README.md, but very short, including a single screen shot).


## Technical Design
### Overview
My website has several components. When you open the website, you get to the introduction. This is the title, with a short introduction on the topic. To go to the data visualizations, you click the arrow to automatically scroll down, or you can just scroll down yourself. When you do, the background image stays fixed.

The first visualization is a world map, showing depression and suicide rates around the world. You can switch which data is displayed on the world map by clicking the button of 'Depression' or 'Suicide' above the world map. When you hover over the map, it will show a tooltip with the name of the country, and both the depression and suicide rates there.

Clicking on a country will take you to the next screen with a line graph and bar chart. The line graph shows trends in depression rates from 1995 to 2015. The bar charts shows the demographics of depression in a country by age group and gender.

When you've clicked on a country in the map, the line of that country will be highlighted in the line graph, and the bar chart will update with the values for that country. In the line graph, you can hover over the different lines to see what country it is. Clicking a line will make it highlighted and this will update the bar chart.

Above the bar chart, there are buttons for different regions in the world. If you select a button, all lines of the countries of that region will be highlighted in the line graph and the button will change color. This way, you can compare the different regions with each other. If you have selected a country in the line graph, you can easily navigate up with the up-arrow above the line graph, to see the selected country on the world map.

### Implementation
Clearly describe the technical design: how is the functionality implemented in your code? This should be like your DESIGN.md but updated to reflect the final application. First, give a high level overview, which helps us navigate and understand the total of your code (which components are there?). Second, go into detail, and describe the modules/classes and how they relate.

My code is divided into several files containing functions for each visualization. In `main.js` I load the data for the world map using `d3.queue`, format this data and call the different functions that color the world map, make the line graph and the bar chart.

The world map is colored with the data of depression initially. When a user clicks on the button to select 'suicide', a function will be called to update the map with the new color values. The dataset for this will already be ready and loaded as soon as the page is ready, so this process goes quickly.

Clicking on a country will make the page scroll down to the next visualization using jQuery, and it will call the function `updateBarchart()`, which gets the index of the selected country in the dataset, and updates the barchart to reflect these change. It also calls the function `highlightLine()`, which adds a class 'clicked' to the line of this country.

In `styles.css` I've declared different colors for the classes of the lines. Hovering over the lines will add the class 'hovered', clicking on a line will add 'clicked', and when clicking on the buttons with the different regions the lines get a class corresponding to the region that's selected. This way the different interactions don't overlap or undo each other.





In `functions.js` I've created helper functions that may be used by several of the visualizations.






Initially, the bar chart will show data from The Netherlands, and will be updated to other countries when they are selected.





## Challenges
My final product is very different than what I had originally planned to do. The initial idea, as you can read in [`DESIGN.md`](), was to look at depression and suicide first in the world and then zoom in to The Netherlands. A map would show which areas in The Netherlands had higher depression and suicide rates, and an interactive table would allow users to search different areas to compare the rates of suicide and depression.

In week two, I received an e-mail from *Monitor Volksgezondheidenzorg*, where I hoped to get this data from. They did have some data available, but it would cost me €150, and this would not be region-specific. Because of this, I had to let go of my idea of a map of The Netherlands.

- ### Changed plans  

My new idea was to still zoom in on The Netherlands, but to look at trends (for which I did have data). However, the link to the world map and the rest of the story was not as clear anymore. I decided to let go of any data I'd gathered about The Netherlands specifically, and focus my entire website on depression globally.

I wanted to show trends in a line graph, which allowed you to compare different countries and get a broader picture of depression rates worldwide. This idea matches my final product. For my third visualization, I had thought of a pie chart showing how much money a country spent on mental health care. I also had the idea to make a scatterplot with .

I found data that would support my pie chart idea, but it was unavailable for many countries.

- ### Linking the visualizations   

Once I was sure about my final visualizations, I ran into the problem of linked them in a good way. I wanted my visualizations to be big, so it would be easier to select elements or find countries on the world me. This did mean that it wouldn't fit in one screen, even though they did have to be linked.

I had already linked my line graph to my world map, by highlighting countries and lines on hover. If it wouldn't be visible in one screen, however, this wasn't a useful feature.

That is why I decided to change this from lines being highlighted on hovering, to the line being selected by clicking on a country. I also thought it would be intuative to automatically scroll to this visualization when a country is clicked. If a user is interested in a country, clicking on it will show them more.

- ### Creating a story  

It was import to me that all my visualizations told a new part of a story. In my first idea, I had a very clear idea of how it all worked together to tell a different element of my story. With my changed plans, I found it harder to make all the elements come together in a logical way.

To figure out how to make it work, I created new (simple) sketches for my final layout. I wanted my introduction to stand out, which is why I created a homepage showing just that and the title. It forces the user to focus only on this paragraph of text, without being distracted by other elements on the screen. To guide the reader through the different parts, I added a button that scrolls to the next screen.



- ### Technical limitations  

One of the technical challenges was to make the different elements work together, without one overriding the other. My line graph would not work

- Demographics buttons
- Line graph with the buttons not working

- Had more data/ideas for visualizations but not enough time


Clearly describe challenges that your have met during development. Document all important changes that your have made with regard to your design document (from the PROCESS.md). Here, we can see how much you have learned in the past month.

## Decisions
Defend your decisions by writing an argument of a most a single paragraph. Why was it good to do it different than you thought before? Are there trade-offs for your current solution? In an ideal world, given much more time, would you choose another solution?



Make sure the document is complete and reflects the final state of the application. The document will be an important part of your grade.
