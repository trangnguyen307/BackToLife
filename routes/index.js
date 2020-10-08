const express = require('express');
const Post = require('../models/Post.model');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home', {userInSession: req.session.currentUser});
});

router.get('/about', (req,res,next) => {
  res.render('about', {userInSession: req.session.currentUser});
});
router.get('/help', (req,res,next) => {
  res.render('help', {userInSession: req.session.currentUser});
});

module.exports = router;
