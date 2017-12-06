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
const initPassport = require('./server/api/auth/passport');


const app = express();
app.use(cors());
app.use(metricsMiddleware);

// require('./passport')(passport);

// require('./server/api/auth/passport')(app)

// const index = require('./routes/index')(passport);


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

app.use(express.static(path.join(__dirname, 'public')));
initPassport(app);

app.use('/api/v1', apiRoutes);
// app.use('/', )

app.get('/', (req, res, next) => {
	isCandidator = req.query.q && req.query.q === '1';
	res.render('index');
});

app.use('/auth/:type/callback', (req, res) => res.redirect(`/api/v1/user/auth/${req.params.type}/callback?code=${req.query.code}`));


app.get('/start', (req, res, next) => {
	console.log('req.user', req.user);
	console.log('res.isAuthenticated()', req.isAuthenticated());

	if (req.isAuthenticated()) {
		res.render('start');
	}
	res.redirect('/');
});
// app.use('/', index);

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
