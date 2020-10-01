const express = require('express');
const { NotExtended } = require('http-errors');
const router = express.Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Offer = require('../models/Offer.model');
const fileUploader = require('../configs/cloudinary.config');
const { Router } = require('express');

// FAIRE UN OFFRE

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
  
  console.log('creatorId:', req.session.currentUser._id)
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
  const {search,categories, city} = req.query
  console.log('req.query: ',req.query)
  
  //
  // se consittuer un objet query en fonction de
  //

  let query = {};
  if (search) {
  query.title = {"$regex": req.query.search, "$options":"i"}
  }
  if (categories) {
    query.categories = req.query.categories
  }
  if (city) {
    query.city = req.query.city
  }

  Post.find(query).sort({createdAt:-1})
    .then(postsFromDb => {
      res.render('posts/categories.hbs', {
        posts : postsFromDb,
        userInSession: req.session.currentUser,
      });
    })
    .catch(next);
});

router.post('/categories', (req,res,next) => {
  //console.log(req.body)
})

router.get('/:id/offer', function (req, res, next) {
  
  if (!req.session.currentUser) {
    return next(new Error('You must be logged to create a post'));
  }

  res.render('posts/offer', {
    userInSession: req.session.currentUser,
    id: req.params.id
  })
});

router.post('/:id/offer', function (req, res, next) {
  if (!req.session.currentUser) return next(new Error('You must be logged to create a comment'));

  const id = req.params.id;
  console.log("req.body:", req.body)

  Post.findById(id).then(post => {
    //const creatorId = post.creatorId
    Offer.create({
        postId: req.params.id,
        creatorId: post.creatorId,
        authorId: req.session.currentUser._id,
        goodToExchange: req.body.goodToExchange,
        pointsEstimate: req.body.pointsEstimate,
        messages: req.body.messages,
      })
        .then(offer => {
          res.redirect(`/posts/categories`);
        })
        .catch(next)
      ;

  }).catch(next)
  
});


// AFFICHER LE DETAIL D'UN POSTE

router.get('/:id', function (req, res, next) {
  const id = req.params.id;

  Post.findById(id)
    .populate()
    .then(post => {
      console.log('post creator:',post.creatorId);
      const id = post.creatorId;
      User.findById(id).then(userFromDb => {
        console.log('creator username:',userFromDb.username);
        res.render('posts/show', {
          post: post,
          userInSession: req.session.currentUser,
          userFromDb: userFromDb
        })
      })
     
    }).catch(next);
  
});


module.exports = router;