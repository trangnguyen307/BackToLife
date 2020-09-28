const express = require('express');
const { NotExtended } = require('http-errors');
const router = express.Router();
const Post = require('../models/Post.model');
const fileUploader = require('../configs/cloudinary.config');
const { Router } = require('express');

// CREER UN POSTE
router.get('/new', function (req, res, next) {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('posts/new',{userInSession: req.session.currentUser});
});

router.post('/new', fileUploader.single('pic'), function (req, res, next) {
  if (!req.session.currentUser) {
    return next(new Error('You must be logged to create a post'));
  }
  
  console.log('creatorId:', req.session.currentUser.id)
  Post.create({
    title: req.body.title,
    creatorId: req.session.currentUser._id,
    description: req.body.description,
    picURL: req.file.path,
    pointsEstimate:req.body.pointsEstimate,
    city: req.body.city,
    categories: req.body.categories,
    type: req.body.type
  })
    .then(post => res.redirect('/posts/categories'))
    .catch(next)
  ;
});

// AFFICHER TOUS LES POSTES

router.get('/categories', (req,res,next) => {
  Post.find().sort({"createdAt": -1})
    .then(postsFromDb => {
      res.render('posts/categories.hbs', {
        posts : postsFromDb,
        userInSession: req.session.currentUser
      });

    })
    .catch(next);
})

// AFFICHER LE DETAIL D'UN POSTE

router.get('/:id', function (req, res, next) {
  const id = req.params.id;

  Post.findById(id)
    .then(post => {
      console.log(post.createdAt.date)
      res.render('posts/show', {
        post: post,
        user: req.session.currentUser
      });
    })
    .catch(next);
  ;
});

module.exports = router;