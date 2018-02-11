const express = require('express');
const  path = require('path');
const  bodyParser = require('body-parser');
const  passport = require('passport');
const  cors = require('cors');
const  mongoose = require('mongoose');
const  exphbs = require('express-handlebars');
const  methodOverride = require('method-override');
const  flash = require('connect-flash');
const  session = require('express-session');
const  app = express();
//load routers
const users = require('./routes/users');
//passport
require('./config/passport')(passport);
//database config
const db = require('./config/database');

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
 