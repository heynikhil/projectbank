const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  active: { 
    type: Boolean, 
    defaultValue: false 
  },
  secretToken: { 
    type: String 
  },
  isAdmin: {
    type: Boolean, 
    defaultValue: false 
  },
  isUser: { 
    type: Boolean, 
    defaultValue: true 
  },
  date: {
    type: Date,
    default: Date.now
  }, 
  resetPasswordToken: {
    type: String}
});

mongoose.model('users', UserSchema);