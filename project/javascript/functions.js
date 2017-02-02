/**
 * functions.js
 *
 * Helper functions for the visualizations
 *
 * Eline Jacobse
 * Programmeerproject
 * Student: 11136235
 *
 */

// returns the style of a given element
function getStyle(element, property) {
    return window.getComputedStyle(element, null).getPropertyValue(property);
}

// gets the index of a country in the given dataset
function findIndexOf(data, value) {
    var index;
    var i = 0;
    for (i; i < data.length; i++) {
        if (data[i].country == value) {
            index = i;
            return index;
        }
    }
    return false;
}

$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
