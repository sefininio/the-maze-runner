$(document).ready(function() {
    $('#terminal').bgTerminal({
        url: '/text/index',
        glow: true,
        speed: 50,
        wait: 300,
    });

    getTopScores();
});

function getTopScores() {
    $.ajax('/top-scores').then(function(res) {
        for (let i = 0; i < 5; i++) {
            if (res[i]) {
                const score = res[i];

                $(`#top-score-${i + 1}`).replaceWith(`
						<div id="top-score-${i + 1}" class="top-score-item">
			                ${i + 1}. <span>${score.user.displayName}, Score: ${score.score}</span>
            			</div>
					`);
            } else {
                $(`#top-score-${i + 1}`).replaceWith(`
						<div id="top-score-${i + 1}"  class="top-score-item">
			                ${i + 1}. <span>Free slot</span>
            			</div>
					`);
            }
        }
    });
}
