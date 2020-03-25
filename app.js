const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const methodOverride = require('method-override');

const {PORT} = require('./config/config');
const { selectOption, if_eq } = require('./config/functions');

const app = express();

//Public Directory
app.use('/static', express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({
    defaultLayout: 'main', helpers: {select: selectOption, if_eq: if_eq}, saveUninitialized: true, resave: true}));
app.set('view engine' , 'handlebars');
app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    cookie: {
        path    : '/',
        httpOnly: false,
        maxAge  : 24*60*60*1000
    },
    secret: 'WebSystemsFinalSecretKey',
    saveUninitialized: true,
    resave: true
}));


app.use(flash());
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body == 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
});
//Routes
const homepage = require('./routes/homepage');
const forums = require('./routes/forums');
const account = require('./routes/account');
const store = require('./routes/store');
const hiscores = require('./routes/hiscores');
const logs = require('./routes/logs');

app.use('/', homepage);
app.use('/forums', forums);
app.use('/account', account);
app.use('/store', store);
app.use('/hiscores', hiscores);
app.use('/logs', logs);

//404 Redirect
app.use(function(req, res, next) {
    return res.status(404).redirect('/404');
});

//Open connection
app.listen(PORT, () => {
    console.log(`Accepting connections on port ${PORT}`);
});

