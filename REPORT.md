# Report

Eline Jacobse  
1612335

## 1. Description

*Subject, intended audience, goal, etc.
Start with a short description of your application (like in the README.md, but very short, including a single screen shot).*

In my project I look at depression and suicide around the world. The goal is to create awareness of depression, and show more people in what countries people are depressed, what the demographics of the people who are depressed are, and how this has changed over the past ten years.

## 2. Technical Design
### 2.1 Overview
My website has several components. When you open the website, you get to the introduction. This is the title, with a short introduction on the topic. To go to the data visualizations, you click the arrow to automatically scroll down, or you can just scroll down yourself. When you do, the background image stays fixed.

The first visualization is a world map, showing depression and suicide rates around the world. You can switch which data is displayed on the world map by clicking the button of 'Depression' or 'Suicide' above the world map. When you hover over the map, it will show a tooltip with the name of the country, and both the depression and suicide rates there.

Clicking on a country will take you to the next screen with a line graph and bar chart. The line graph shows trends in depression rates from 1995 to 2015. The bar charts shows the demographics of depression in a country by age group and gender.

When you've clicked on a country in the map, the line of that country will be highlighted in the line graph, and the bar chart will update with the values for that country. In the line graph, you can hover over the different lines to see what country it is. Clicking a line will make it highlighted and this will update the bar chart.

Above the bar chart, there are buttons for different regions in the world. If you select a button, all lines of the countries of that region will be highlighted in the line graph and the button will change color. This way, you can compare the different regions with each other. If you have selected a country in the line graph, you can easily navigate up with the up-arrow above the line graph, to see the selected country on the world map.

### 2.2 Implementation
*Clearly describe the technical design: how is the functionality implemented in your code? This should be like your DESIGN.md but updated to reflect the final application. First, give a high level overview, which helps us navigate and understand the total of your code (which components are there?). Second, go into detail, and describe the modules/classes and how they relate.*

My code is divided into several files containing functions for each visualization. In `main.js` I load the data for the world map using `d3.queue`, format this data and call the different functions that color the world map, make the line graph and the bar chart.

The world map is colored with the data of depression initially. When a user clicks on the button to select 'suicide', a function will be called to update the map with the new color values. The dataset for this will already be ready and loaded as soon as the page is ready, so this process goes quickly.

Clicking on a country will make the page scroll down to the next visualization using jQuery, and it will call the function `updateBarchart()`, which gets the index of the selected country in the dataset, and updates the barchart to reflect these change. It also calls the function `highlightLine()`, which adds a class 'clicked' to the line of this country.

In `styles.css` I've declared different colors for the classes of the lines. Hovering over the lines will add the class 'hovered', clicking on a line will add 'clicked', and when clicking on the buttons with the different regions the lines get a class corresponding to the region that's selected. This way the different interactions don't overlap or undo each other.

Initially, the bar chart will show data from The Netherlands, and will be updated to other countries when they are selected. Hovering over the barchart will show a tooltip using `d3-tip`.

In `functions.js` I've created helper functions that may be used by several of the visualizations.


## 3. Choices and Challenges
*Clearly describe challenges that your have met during development. Document all important changes that your have made with regard to your design document (from the PROCESS.md). Here, we can see how much you have learned in the past month.*  

My final product is very different than what I had originally planned to do. The initial idea, as you can read in [`DESIGN.md`](), was to look at depression and suicide first in the world and then zoom in to The Netherlands. A map would show which areas in The Netherlands had higher depression and suicide rates, and an interactive table would allow users to search different areas to compare the rates of suicide and depression.

**TODO: Add sketch**

In week two, I received an e-mail from *Monitor Volksgezondheidenzorg*, where I hoped to get this data from. They did have some data available, but it would cost me €150, and this would not be region-specific. Because of this, I had to let go of my idea of a map of The Netherlands.

### 3.1 Changing plans  

My new idea was to still zoom in on The Netherlands, but to look at trends (for which I did have data). However, the link to the world map and the rest of the story was not as clear anymore. I decided to let go of any data I'd gathered about The Netherlands specifically, and focus my entire website on depression globally.

I wanted to show trends in a line graph, which allowed you to compare different countries and get a broader picture of depression rates worldwide. This idea matches my final product.

For that first idea (the pie chart), the data I had found was missing information for many countries, so it wouldn't not paint a very complete picture.

### 3.2 Linking the visualizations   

Once I was sure about my final visualizations, I ran into the problem of linked them in a good way. I wanted my visualizations to be big, so it would be easier to select elements or find countries on the world map. This did mean that it wouldn't fit in one screen, even though they did have to be linked.

I had already linked my line graph to my world map, by highlighting countries and lines on hover. If it wouldn't be visible in one screen, however, this wasn't a useful feature.

That is why I decided to change this from lines being highlighted on hovering, to the line being selected by clicking on a country. I also thought it would be intuitive to automatically scroll to this visualization when a country is clicked. If a user is interested in a country, clicking on it will show them more.

### 3.3 Creating a story  

It was import to me that all my visualizations told a new part of a story. In my first idea, I had a very clear idea of how it all worked together to tell a different element of my story. With my changed plans, I found it harder to make all the elements come together in a logical way.

To figure out how to make it work, I created new (simple) sketches for my final layout. I wanted my introduction to stand out, which is why I created a homepage showing just that and the title. It forces the user to focus only on this paragraph of text, without being distracted by other elements on the screen. To guide the reader through the different parts, I added a button that scrolls to the next screen.

### 3.4 Colors  

In the first versions of my project I had colored the map with red colors. During the Friday presentations, I'd gotten the feedback from someone that they would use blue instead, since that's the color they would associate with depression. After looking into different options, I ended up going with the color scale I have now.

One problem with these colors, was that I had a white background and the lightest color blue was hard to see on the screen. I had already decided to use different background-colors (white and very light-grey) in the different sections, so to solve this problem I decided to make this section grey instead of white. This made the blue stand out more.

### 3.5 Technical challenges  

##### 3.5.1 Formatting the Data

Grouped bar chart.

##### 3.5.2 Line graph
One of the technical challenges was to make the different elements work together, without one overriding the other. My line graph would not work well at first. If I clicked on a line, it would stay highlighted even after clicking another one. Or it would only show the country name, and not work on hover. Because this line graph works both with hover, click, the different buttons and the world map, it had many factors to consider.

As I was adding more function to it, this was becoming harder to do. So I eventually had to rewrite the functions I had, to make them work more efficiently.

##### 3.5.3 World Map
Getting the tooltip to work with `D3 Datamaps` was also a challenge. Since I wanted every visualization to interact with the others, I needed to override the built-in hover function. Then I needed to manually add a tooltip to the datamap in an onhover function, which didn't work at first. I did fix this, but because it occasionally lags on a slower computer because of the function event.X

My idea was to show suicide rates when the map was colored for suicide values, and depression rates in the tooltip when depression was shown. However, because of the way the built-in function of DataMaps `updateChoropleth()` works, I colored the map with a dataset that didn't contain values, but fillColors instead. Once I had already implemented most of my website, I had no time to figure out a way around this so I could show different data in the tooltip. I chose to display both suicide and depression rates in the tooltip instead.

### 3.6 Deciding what to leave out

For me possibly one of the hardest challenges of this project was deciding what functions and ideas to leave out. I had data and ideas for two more visualizations, which I wanted to create below my current visualizations. However, due to the time restraints, I had to leave those ideas out.

For my third visualization, I had thought of a pie chart showing how much money a country spent on mental health care. I also had the idea to make a scatterplot with on one axis the amount of mental health care workers (psychologists/psychiatrists) that are available per 100,000 people, and on the other the depression/suicide rates for each country.

Even with that, it was hard for me not to keep adding more small details to the page. Especially after seeing other projects every Friday, I would be inspired to add new features or functionality to my website. One feature I had already made, was a menu bar with different headers showing where you were on the page. This would only show up after you'd scrolled past the initial page. Clicking on the different titles would take you to that section of the page.

Since I was very happy to have gotten this to work, it was hard to decide to delete this. I asked classmates for feedback, and decided that it was not very functional and only distracted from the actual visualizations. If I had more sections on the website, it might have been a useful feature for navigation. Since my page is not that long, it was not necessary to have it.

The same goes for an interactive table that I made in my first week. It had suicide data and allowed you to search for a particular country. I had meant for that to be linked to my map of The Netherlands, and have data for different regions in the country. Since that plan fell through, I had to delete the table.

With all of these points, the challenge was to not get lost in ideas and cool features, but to focus on improving what I already had and telling the story well.

## 4. Decisions
*Defend your decisions by writing an argument of a most a single paragraph. Why was it good to do it different than you thought before? Are there trade-offs for your current solution? In an ideal world, given much more time, would you choose another solution?*

Looking back on my process, I think changing the focus of my website from depression in The Netherlands to depression and suicide worldwide was the right decision. My website and the different visualizations are cohesive and tell a story. If I would have added more visualizations to the page, I would definitely have run into problems with my time and the overall flow would not have worked out as well. If I had been given more time, however, I would

The story and the visualizations work well together and are more cohesive than my original idea would have been.
