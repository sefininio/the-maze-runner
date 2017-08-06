$(document).ready(function () {
	$('#terminal').bgTerminal({
		url: '/text/welcome',
		glow: true,
		speed: 50,
		wait: 300
	});

	$.get('/maze-id', function (id) {
		$('.maze-id').text('' + id);
	});
});