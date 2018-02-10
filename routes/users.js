const express = require('express'),
 mongoose = require('mongoose'),
 jwt = require('jsonwebtoken'),
 bcrypt = require('bcryptjs'),
 request = require('request'),
 nodemailer = require('nodemailer'),
 router = express.Router(),
 passport = require('passport');
require('../models/user');
const User = mongoose.model('users');
const sgMail = require('@sendgrid/mail');
const async = require('async');
const crypto = require('crypto');
const http = require('http');
const { ensureAuthenticated } = require('../helpers/auth');




//GET login
router.get('/login', (req, res) => {
  res.render('users/login');
});

//GET register
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//POST Register
router.post('/register', (req, res) => {
  let errors = [];
  let cPwd = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
  let cUname = /^[a-z0-9_-]{4,15}$/;
  let cMob = /^[6789]\d{9}$/;
  let cName = /^[A-Za-z\s]+$/;
  let cEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$/;

  if (cEmail.test(req.body.email) === false) {
    errors.push({ text: 'Enter Valid Email' });
  }
  if (cName.test(req.body.name) === false) {
    errors.push({ text: 'Enter Valid Name' });
  }
  if (cPwd.test(req.body.password) === false) {
    errors.push({ text: 'Password Should contain Minimum eight characters, at least one letter, one number and one special character' });
  }
  if (cMob.test(req.body.mobile) === false) {
    errors.push({ text: 'Enter Valid Mobile Number' });
  }
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            password: req.body.password,
            active: false,
            isAdmin: false,
            isUser: true,
            isBlock: false,
            resetPasswordToken:''
          });

          var secretToken = jwt.sign({ email: req.body.email }, 'qwertgfdsa', { expiresIn: '1h' });
          newUser.secretToken = secretToken;
          if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            req.flash('error_msg', 'Please select captcha');
            res.redirect('users/register');
            return;
          }
          var secretKey = "6LciSUMUAAAAAHhOPz--EbBkG9StviBXELfEuRZ1";
          var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
          request(verificationUrl, function (error, response, body) {
            body = JSON.parse(body);
            console.log(body);
            if (body.success !== undefined && !body.success) {
              return res.redirect('users/register');
            }
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save();
            })
          });
          var smtpTransport = nodemailer.createTransport( {
            service: 'SendGrid',
            auth: {
              user: 'nikhil1337',
              pass: 'sin30=1/2'
            }
          });
          const url = `http://localhost:3000/users/verify/${secretToken}`;
          const msg = {
            to: req.body.email,
            from: 'admin@localhost.com',
            subject: 'Please verify your email!',
            text: '`Hi there',
            html:`<br/>
              Thank you for registering!
               <br>
              Please verify your email by clicking the following link:
              <br>

              <br>
              On the following page:
              <a href="${url}">${url}</a>
              <br> <br>
              Thank You`
          }
          smtpTransport.sendMail(msg);
          req.flash('success_msg', 'Please Check Your Mail');
          res.redirect('/users/login');
        }
      })
  }
})

// Email Verificaation
router.route('/verify/:secretToken')
  .get(async (req, res) => {
    try {
      const secretToken = req.params.secretToken;
      const { 'email': email } = jwt.verify(req.params.secretToken, 'qwertgfdsa');
      const user = await User.findOne({ 'secretToken': secretToken });
      user.active = true;
      await user.save();
      req.flash('success_msg','Thank you! Now you may login.');
      res.redirect('/users/login');
    } catch (e) {
      throw e;
    }
  })

//Get Forgot password
router.get('/forgot', function (req, res) {
  res.render('users/forgot', {
    user: req.user
  });
});
;
router.post('/forgot', function (req, res, next) {
  async.waterfall([
    function (done) {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function (token, done) {
      User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
          req.flash('error_msg', 'No account with that email address exists.');
          return res.redirect('forgot');
        }
        user.resetPasswordToken = token;
        user.save(function (err) {
          done(err, token, user);
        });
      });
    },
    function (token, user, done) {
      var smtpTransport = nodemailer.createTransport( {
        service: 'SendGrid',
        auth: {
          user: 'nikhil1337',
          pass: 'sin30=1/2'
        }
      });
      var msg = {
        to: user.email,
        from: 'admin@localhost.com',
        subject: 'Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(msg, function (err) {
        req.flash('success_msg', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function (err) {
    if (err) return next(err);
    res.redirect('forgot');
  });
});

//reset passowrd verification
router.get('/reset/:token', function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid.');
      return res.redirect('forgot');
    }
    res.render('users/reset', {
      user: req.user
    });
  });
});

//reset email send & password entry new
router.post('/reset/:token', function (req, res) {
  async.waterfall([
    function (done) {
      User.findOne({ resetPasswordToken: req.params.token }, function (err, user) {
        if (!user) {
          req.flash('error_msg', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            console.log(req.body.password)
            if (err) throw err;
            req.body.password = hash;
            console.log(req.body.password);
            user.password = hash;
            user.save(function (err) {
              req.logIn(user, function (err) {
                done(err, user);
              });
            });
          })
        });
        
      });
    },
    function (user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: 'nikhil1337',
          pass: 'sin30=1/2'
        }
      });
      var msg = {
        to: user.email,
        from: 'admin@localhost.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(msg, function (err) {
        req.flash('success_msg', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function (err) {
    res.redirect('/');
  });
});

//get Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('users/dashboard');
});


//Get Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;