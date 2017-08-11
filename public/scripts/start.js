$(document).ready(function () {
	$('#terminal').bgTerminal({
		url: '/text/start',
		glow: true,
		speed: 50,
		wait: 300
	});
});

function timiClick() {
	if (!$('.timi-text').length) {
		$.ajax('/timi')
			.then(function (res) {
				$('body').append('<div class="timi-text">> Timi says: ' + res + '</div>');
			});

	}
}