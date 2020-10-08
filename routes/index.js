const express = require('express');
const Post = require('../models/Post.model');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/about', (req,res,next) => {
  res.render('about');
});
router.get('/help', (req,res,next) => {
  res.render('help');
});

module.exports = router;
