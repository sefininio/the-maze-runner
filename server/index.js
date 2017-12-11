const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const apiRoutes = require('./api/routes/index');
const initPassport = require('./api/auth/passport');
const db = require('./mongoose');
const app = express();

const env = process.env.NODE_ENV;
const port = process.env.PORT || 3000;

console.log('env', env)

db.connect();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'idrivemycartothemazecenter' }));
console.log('__dirname', __dirname)
app.use(express.static(path.join(__dirname, './../public')));
initPassport(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/v1', apiRoutes);

if (env === 'development') {
	console.log("!!!!!!!!!");
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const webpack = require('webpack');
	const webpackConfig = require('./../webpack.config')();
	const compiler = webpack(webpackConfig);

	app.use(webpackDevMiddleware(compiler, {
		noInfo: true,
		publicPath: webpackConfig.output.publicPath // Same as `output.publicPath` in most cases.
	}));
	app.use(webpackHotMiddleware(compiler));
}



app.use('/auth/:type/callback', (req, res) => res.redirect(`/api/v1/user/auth/${req.params.type}/callback?code=${req.query.code}`));

app.get('/start', (req, res, next) => {
	console.log('req.user', req.user);
	console.log('res.isAuthenticated()', req.isAuthenticated());

	if (req.isAuthenticated()) {
		res.render('start');
	} else {
		res.redirect('/');
	}
});

// temporary dev routes -
app.get('/*', (req, res, next) => {
	res.render('newIndex');
});


app.use(function (err, req, res, next) {
	console.log('err', err);
	console.error(err.stack)
	res.status(500).send('Something broke!')
});

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {

	app.listen(port, err => {
		if (err) {
			res.render('error');
		}

		console.log(`Listening on port ${port}`);
	});

}



module.exports = app;


