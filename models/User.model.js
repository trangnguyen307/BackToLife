const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    myphoto: {
      type:String,
      default: 'https://res.cloudinary.com/dyybiq3aw/image/upload/v1601581026/project2-upload/photovide_utfkuw.png'
    },
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
    transactions: {
      type: String,
      default: '0'}, 
    mypoints: {
      type: String,
      default: '2'},
    // add password property here
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
