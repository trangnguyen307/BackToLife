const express = require('express');
const { NotExtended } = require('http-errors');
const router = express.Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Offer = require('../models/Offer.model');
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
    query.categories = req.query.categories;
    
  }
  if (city) {
    query.city = req.query.city
  }

  Post.find(query).sort({createdAt:-1})
    .then(postsFromDb => {
      const cats = [{name:'Dressing'},{name:'Books/CDs'},{name:'Services'},{name:'Beauty'},{name:'IT'}];
      let selected;
      cats.forEach(cat => {
        console.log('categorie',cat)
        console.log('req.query.categories',req.query.categories)
        if (req.query.categories === cat.name) {
          cat.selected = true;
        }
      })
      
      res.render('posts/categories.hbs', {
        posts : postsFromDb,
        userInSession: req.session.currentUser,
        cats:cats
      })
      .catch(err =>next(err));
    });
  })


router.post('/categories', (req,res,next) => {
  //console.log(req.body)
})

//
//EDITER OFFRE
//
router.get('/:offerid/editoffer',(req,res,next) => {
  //if (!req.session.currentUser) return next(new Error('You must be logged to create a comment'));

  Offer.findById(req.params.offerid)
    .then(offer => {
      res.render('posts/offer-edit',{
        userInSession: req.session.currentUser,
        offer:offer
      })
    })
    .catch(err=>next(err))
  
 
})
//
//FAIRE D UN OFFRE
//
router.get('/:id/offer', function (req, res, next) {
  
  if (!req.session.currentUser) {
    return next(new Error('You must be logged to create a post'));
  }

  const id = req.params.id
  Post.findById(id)
    .then(post => {
      Post.find({creatorId:req.session.currentUser}).then(postsFromDb => {
        res.render('posts/offer', {
          userInSession: req.session.currentUser,
          post: post,
          posts: postsFromDb
        })
      })
      
    })
    .catch(err => next(err))
});

router.post('/:id/offer', function (req, res, next) {
  if (!req.session.currentUser) return next(new Error('You must be logged to make an offer'));

  const id = req.params.id;
  console.log("req.body:", req.body)

  Post.findById(id).then(post => {
    //const creatorId = post.creatorId
    Offer.create({
        postId: req.params.id,
        creatorId: post.creatorId,
        authorId: req.session.currentUser._id,
        goodToExchange: req.body.goodToExchange,
        //pointsEstimate: req.body.pointsEstimate,
        messages: req.body.messages
      })
        .then(offer => {
          console.log('offer:', offer)
          res.redirect(`/posts/categories`);
        })
        .catch(next)
      ;

  }).catch(next)
  
});





//
//SUPPRIMER OFFRE
//

//
// EDITER POST
//
router.get('/:id/edit',(req,res,next) => {
  Post.findById(req.params.id)
    .then(post => {
      const cats = [{name:'Dressing'},{name:'Books/CDs'},{name:'Services'},{name:'Beauty'},{name:'IT'}];
      let selected;
      cats.forEach(cat => {
        console.log('categorie',cat)
        console.log('post.categories',post.categories)
        if (post.categories === cat.name) {
          cat.selected = true;
        }
      })
      res.render('posts/edit', {cats,post,userInSession:req.session.currentUser})
    })
    .catch(err=>next(err))

})

router.post('/:id/edit', (req,res,next) => {
  console.log('req.body:   ',req.body)
  Post.findOneAndUpdate({_id:req.params.id}, {
    categories: req.body.categories,
    title: req.body.title,
    description: req.body.description,
    //picURL: req.file.path,
    pointsEstimate:req.body.pointsEstimate,
    city: req.body.city
  },{new:true})
    .then(postUpdated => {
      console.log('postupdate:  ',postUpdated)
      res.redirect ('/profile/myprofile')
    })
    .catch(err => next(err))
})

//
// SUPPRIMER D'UN POST
//
router.post('/:id/delete',(req,res,next) => {
  Post.findByIdAndRemove(req.params.id)
    .then(post => res.redirect('/profile/myprofile'))
    .catch(err=>next(err))
})

//
// AFFICHER LE DETAIL D'UN POSTE
//
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