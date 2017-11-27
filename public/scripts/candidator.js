$(document).ready(function () {
	let answer = '';
	let score = null;
	const hello = 'world';

	let editor = ace.edit('editor');
	editor.setTheme('ace/theme/monokai');
	editor.getSession().setMode('ace/mode/javascript');
	editor.getSession().setUseWrapMode(true);
	editor.getSession().setTabSize(2);

	submit = () => {
		axios.post('http://localhost:3000/candidator/validate', { code: answer })
			.then(res => {
				$('.score').show();
				$('.submit').text('Resubmit');
			  $('.result')
          .text(res.data.score + '%')
			    .addClass(res.data.score >= 70 ? 'pass' : 'fail');
				score = res.data.score;
			})
			.catch(err => {
				$('.result').hide();
				console.log(err);
			});
	};

	next = () => {
		console.log('next');
	};

	onChange = code => {
		answer = code.replace(/\n/ig, '');
	};
});

