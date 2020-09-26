const express = require('express');
const { NotExtended } = require('http-errors');
const router = express.Router();
const Post = require('../models/Post.model');
const fileUploader = require('../configs/cloudinary.config');


router.get('/new', function (req, res, next) {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('posts/new');
});

router.post('/', fileUploader.single('pic'), function (req, res, next) {
  if (!req.session.currentUser) {
    return next(new Error('You must be logged to create a post'));
  }
  
  console.log('creatorId:', req.session.currentUser.id)
  Post.create({
    title: req.body.title,
    creatorId: req.session.currentUser.id,
    description: req.body.description,
    picURL: req.file.path,
    pointsEstimate:req.body.pointsEstimate,
    city: req.body.city,
    categories: req.body.categories,
    type: req.body.type
  })
    .then(post => res.redirect('/'))
    .catch(next)
  ;
});

// router.get('/post-display', (req, res) => 
//   res.render('post-display')
//   );
module.exports = router;