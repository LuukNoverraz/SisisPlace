var images = ["images/1.png", "images/2.png", "images/3.png"]

var randomImage = Math.floor(Math.random() * 3)

$(document).ready(function() {
    $("body").css("background-image", "url(" + images[randomImage] + ")");
})