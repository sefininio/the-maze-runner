const express = require('express');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
const apiRoutes = require('./server/api/routes/index');
// const passport = require('./server/api/auth/passport');

const app = express();

const env = process.env.NODE_ENV;

console.log('env', env);


app.use(cors());
app.use(metricsMiddleware);

require('./passport')(passport);

if (env === 'development') {
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const webpack = require('webpack');
	const webpackConfig = require('./webpack.config')();
	const compiler = webpack(webpackConfig);
	// compiler.apply(new DashboardPlugin({
	// 	port: port,
	// }));


	app.use(webpackDevMiddleware(compiler, {
		noInfo: true,
		publicPath: webpackConfig.output.publicPath // Same as `output.publicPath` in most cases.
	}));
	app.use(webpackHotMiddleware(compiler));
}



app.get('/lalala', (req, res) => {
	res.json({
		lala: 'works'
	});
});




//const index = require('./routes/index')(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'idrivemycartothemazecenter' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.get('/*', (req, res) => {
	res.render('newIndex');
});
app.use('/api/v1', apiRoutes);
// app.use('/', )

// catch 404 and forward to error handler
app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
// console.log('req.app.get("env")', req.app.get("env"))
	console.log('err', err);
	// console.log("SEFI THE KING")
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
