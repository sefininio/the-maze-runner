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



db.connect();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'idrivemycartothemazecenter' }));
app.use(express.static(path.join(__dirname, 'public')));
initPassport(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/api/v1', apiRoutes);


// temporary dev routes -
app.get('/', (req, res, next) => {
	res.render('index');
});

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

app.listen(port, err => {
	if (err) {
		res.render('error');
	}

	console.log(`Listening on port ${port}`);
});



