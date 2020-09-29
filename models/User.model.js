const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    //myphoto: String,
    city: {
      type: String,
      trim: true,
      required: [true, 'City is required.'],
    },
    mydescription: {
      type: String,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.*@.*\..*/, 'Invalid email']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    // transactions: String, 
    // mypoints: String
    // add password property here
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
