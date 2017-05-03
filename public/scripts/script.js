$(document).ready(function(){
  $('#terminal').bgTerminal({
    url: '../bg.txt', // The page to load and display in the terminal
    glow: true, // If true, the terminal will have a glowing effect
    speed: 100, // Type speed in milliseconds. This is the time between two character are typed
    wait: 1000 // The number of milliseconds to wait at the end of the line (when \n is found)
  });
});

function timiBlink() {
  $(".timi").addTemporaryClass("blink", 200);
}

(function($){
  $.fn.extend({
    addTemporaryClass: function(className, duration) {
      var elements = this;
      setTimeout(function() {
        elements.removeClass(className);
        setTimeout(function() {
          timiBlink();
        }, getRandomTime());
      }, duration);
      
      return this.each(function() {
        $(this).addClass(className);
      });
    }
  });
  
})(jQuery);

function getRandomTime() {
  return Math.floor(Math.random() * 7000);
}

setTimeout(function() {
  timiBlink();
}, getRandomTime());