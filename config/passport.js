const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user model
const User = mongoose.model('users');

module.exports = function (passport) {
  passport.use('local',new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
   //Match user
   console.log(email,password);
    User.findOne({
      email: email
    }).then(user => {
      if (!user) {
        return done(null, false, { message: 'No User Found' });
      }
      if (!user.active) {
        return done(null, false, { message: 'Sorry, you must Verify Your Email first' });
      }
      //Match Password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Enter Correct Password!' });
        }
      })
    })
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}