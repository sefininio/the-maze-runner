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