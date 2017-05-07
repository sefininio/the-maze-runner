$(document).ready(function(){
  $('#terminal').bgTerminal({
    url: '/text/start',
    glow: true,
    speed: 100,
    wait: 1000
  });
});

function timiClick() {
  if (!$('.timi-text').length) {
    $.ajax('/timi')
      .then(function(res) {
        $('body').append('<div class="timi-text">> Timi says: ' + res + '</div>');
      });
    
  }
}