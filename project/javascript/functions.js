/**
 * functions.js
 *
 * Helper functions for the visualizations
 *
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

// function source: http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx/
function colorToHex(color) {
    if (color.substr(0, 1) === '#') {
        return color;
    }
    var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

    var red = parseInt(digits[2]);
    var green = parseInt(digits[3]);
    var blue = parseInt(digits[4]);

    var rgb = blue | (green << 8) | (red << 16);
    return digits[1] + '#' + rgb.toString(16);
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
}

$(document).ready(function(){
    $('[data-toggle="popover"]').popover();
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
});
