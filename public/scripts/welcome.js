$(document).ready(function(){
  $('#terminal').bgTerminal({
    url: '/text/welcome',
    glow: true,
    speed: 100,
    wait: 1000
  });

  $.get('/maze-id', function(id) {
    $('.maze-id').text(''+id);
  });
});