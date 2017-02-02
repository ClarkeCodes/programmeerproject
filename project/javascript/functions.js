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

// function for the footnote popover
// source: https://maxalley.wordpress.com/2014/08/19/bootstrap-3-popover-with-html-content/
$(function(){
    $('[rel="popover"]').popover({
        container: 'body',
        html: true,
        trigger:'focus',
        content: function () {
            var clone = $($(this).data('popover-content')).clone(true).removeClass('hide');
            return clone;
        }
    }).click(function(e) {
        e.preventDefault();
    });
});
