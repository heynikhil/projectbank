const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  passport = require('passport'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  exphbs = require('express-handlebars'),
  methodOverride = require('method-override'),
  flash = require('connect-flash'),
  session = require('express-session'),
  app = express(),
  db = require('./config/database'),
  users = require('./routes/users');
require('./config/passport')(passport);


//mongo Connection
mongoose.connect(db.mongoURI);

//CORS middleware
//app.use(cors());

//Handlebard Engine
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));

app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

//Express Session
app.use(session({
  secret: 'qaswedfrtghyu',
  resave: true,
  saveUninitialized: true
}));

//Passport Session and Init
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Flash Messages
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use('/users',users)
app.get('/',(req,res)=>{
  res.render('users/login')
});

const port = 3000;
app.listen(port, ()=>{
  console.log(`Server Started on port:${port}`);
});
 