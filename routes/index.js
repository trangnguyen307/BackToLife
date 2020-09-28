const express = require('express');
const Post = require('../models/Post.model');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});


module.exports = router;
