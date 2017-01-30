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

// source: https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c#.jldc8p6a3
// Hide Header on on scroll down
// var didScroll;
// var lastScrollTop = 0;
// var delta = 5;
// var navbarHeight = $('header').outerHeight();
//
// $(window).scroll(function(event){
//     didScroll = true;
// });
//
// setInterval(function() {
//     if (didScroll) {
//         hasScrolled();
//         didScroll = false;
//     }
// }, 250);
//
// function hasScrolled() {
//     var st = $(this).scrollTop();
//
//     // Make sure they scroll more than delta
//     if(Math.abs(lastScrollTop - st) <= delta)
//         return;
//
//     // If they scrolled down and are past the navbar, add class .nav-up.
//     // This is necessary so you never see what is "behind" the navbar.
//     if (st > lastScrollTop && st > navbarHeight){
//         // Scroll Down
//         $('header').removeClass('nav-down').addClass('nav-up');
//     } else {
//         // Scroll Up
//         if(st + $(window).height() < $(document).height()) {
//             $('header').removeClass('nav-up').addClass('nav-down');
//         }
//     }
//
//     lastScrollTop = st;
// }
