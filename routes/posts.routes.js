const express = require('express');
const { NotExtended } = require('http-errors');
const router = express.Router();
const User = require('../models/User.model');
const Post = require('../models/Post.model');
const Offer = require('../models/Offer.model');
const fileUploader = require('../configs/cloudinary.config');
const { Router } = require('express');
const { connections } = require('mongoose');



// CREER UN POST
router.get('/new', function (req, res, next) {
  if (!req.session.currentUser) {
    res.redirect('/login');
    return;
  }

  res.render('posts/new',{userInSession: req.session.currentUser});
});

router.post('/new', fileUploader.fields([{name:'pic'}]), function (req, res, next) {
  if (!req.session.currentUser) {
    return next(new Error('You must be logged to create a post'));
  }
  console.log('req.files.path:   ',req.files)
  console.log('creatorId:', req.session.currentUser._id)
  let picURL = [req.files.pic[0]];
  
  if (req.files.pic[1]) {
    picURL.push(req.files.pic[1]);
  }
  Post.create({
    title: req.body.title,
    creatorId: req.session.currentUser._id,
    description: req.body.description,
    picURL: picURL,
    pointsEstimate:req.body.pointsEstimate,
    city: req.body.city,
    categories: req.body.categories,
    type: req.body.type
  })
    .then(post => res.redirect('/posts/categories'))
    .catch(next)
  ;
});



// AFFICHER TOUS LES POSTS

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
    query.city = {"$regex": req.query.city, "$options":"i"}
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
      
    })
    .catch(err =>next(err));
  });


router.post('/categories', (req,res,next) => {
  //console.log(req.body)
})


//
//FAIRE D UN OFFRE
//
router.get('/:id/offer', function (req, res, next) {
  
  if (!req.session.currentUser) {
    //return next(new Error('You must be logged to create a post'));
    res.redirect('/login');
    return;
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

  
    Post.findById(id)
      .then(post => {
        User.findById(req.session.currentUser._id)
        .then(userFromDb => {
          if (userFromDb.mypoints < req.body.pointsEstimate) {
            Post.find({creatorId:req.session.currentUser})
            .then(postsFromDb => {
              res.render('posts/offer', {
                userInSession: req.session.currentUser,
                post: post,
                posts: postsFromDb,
                errorMessage:"You don't have enough flowers to make this offer!"}) 
              })
            .catch(next)
          } else {
            console.log("req.body.goodToExchange      ", req.body.goodToExchange)
            let goodToExchange;
            if (req.body.goodToExchange && req.body.goodToExchange !== '--Select in what you have--') {
              goodToExchange = req.body.goodToExchange;
            } 
            let pointsEstimate;
            if (req.body.pointsEstimate) {
              pointsEstimate = req.body.pointsEstimate;
            } else {
              pointsEstimate = 0;
            }
            Offer.create({
              postId: req.params.id,
              creatorId: post.creatorId,
              authorId: req.session.currentUser._id,
              goodToExchange: goodToExchange,
              pointsEstimate: pointsEstimate,
              messages: req.body.messages
            })
            .then(offer => {
              console.log('offer:', offer)
              res.redirect(`/posts/categories`);
            })
            .catch(next);
          }
        })
        .catch(next);
    
      }).catch(next)
  
  
});


//
//EDITER OFFRE
//
router.get('/:offerid/editoffer',(req,res,next) => {
  //if (!req.session.currentUser) return next(new Error('You must be logged to create a comment'));

  Offer.findById(req.params.offerid).populate('creatorId').populate('postId').populate('goodToExchange')
    .then(offer => {
      console.log(req.session.currentUser._id)
      Post.find({creatorId: req.session.currentUser._id}).then (postsFromDb => {
        console.log('postsFromDb:', postsFromDb)
        console.log('offer.postId', offer.postId)
      
      postsFromDb.forEach(post => {
        console.log('post.id:', post.id)
        console.log('offer.goodToExchange.id', offer.goodToExchange.id)
        if (offer.goodToExchange.id === post.id) {
          post.inselected = true;
        }
      })
        res.render('posts/offer-edit',{
          userInSession: req.session.currentUser,
          offer:offer,
          posts:postsFromDb
        })
      }).catch(err=>next(err))
     
    })
    .catch(err=>next(err))
})

router.post('/:offerid/editoffer',(req,res,next) => {
  let goodToExchange;
  if (req.body.goodToExchange && req.body.goodToExchange !== '--Select in what you have--') {
    goodToExchange = req.body.goodToExchange;
  } 
  let pointsEstimate;
  if (req.body.pointsEstimate) {
    pointsEstimate = req.body.pointsEstimate;
  } else {
    pointsEstimate = 0;
  }
  if (req.body.pointsEstimate<= req.session.currentUser.mypoints) {
    Offer.findByIdAndUpdate(req.params.offerid, {
      goodToExchange: goodToExchange,
      pointsEstimate: req.body.pointsEstimate,
      messages:req.body.messages
    }, {new:true})
      .then(offerUpdated => {
        console.log('offerUpdated:    ',offerUpdated)
        res.redirect('/profile/dashboard')
      })
      .catch(err=>next(err))
  } else {
    Offer.findById(req.params.offerid).populate('creatorId').populate('postId').populate('goodToExchange')
    .then(offer => {
      console.log(req.session.currentUser._id)
      Post.find({creatorId: req.session.currentUser._id}).then (postsFromDb => {
        console.log('postsFromDb:', postsFromDb)
        console.log('offer.postId', offer.postId)
      
      postsFromDb.forEach(post => {
        console.log('post.id:', post.id)
        console.log('offer.goodToExchange.id', offer.goodToExchange.id)
        if (offer.goodToExchange.id === post.id) {
          post.inselected = true;
        }
      })
        res.render('posts/offer-edit',{
          userInSession: req.session.currentUser,
          offer:offer,
          posts:postsFromDb,
          errorMessage: "You don't have enough flowers to make this offer!"
        })
      })
  }).catch(err=>next(err))
}
})
  



//
//SUPPRIMER OFFRE
//
router.post('/:id/deleteoffer',(req,res,next) => {
  Offer.findByIdAndRemove(req.params.id)
    .then(offer => res.redirect('/profile/dashboard'))
    .catch(err=>next(err))
})

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

router.post('/:id/edit', fileUploader.fields([{name:'pic'}]), (req,res,next) => {
  console.log('req.body:   ',req.body)

  Post.findById(req.params.id)
    .then(postFromDb => {
      let picURL= postFromDb.picURL;
      console.log('postFromDb.picURL:   ',postFromDb.picURL);
      if (req.files.pic) {
        console.log('req.files:   ', req.files.pic.length)
        picURL = [req.files.pic[0]];
        if (req.files.pic[1]) {
          picURL.push(req.files.pic[1]);
        }
      }
      Post.findOneAndUpdate({_id:req.params.id}, {
        categories: req.body.categories,
        title: req.body.title,
        description: req.body.description,
        picURL: picURL,
        pointsEstimate:req.body.pointsEstimate,
        city: req.body.city
      },{new:true})
        .then(postUpdated => {
          console.log('postupdate:  ',postUpdated)
          res.redirect (`/posts/${postUpdated.id}`)
        })
        .catch(err => next(err))

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
// AFFICHER LE DETAIL D'UN POST
//
router.get('/:id', function (req, res, next) {
  const id = req.params.id;

  Post.findById(id)
    .populate()
    .then(post => {
      console.log('post.picURL:',post.picURL);
      const id = post.creatorId;
      User.findById(id).then(userFromDb => {
        let showbuttonoffer = true;
        let showimage2;
        if (post.picURL.length === 2) {
          showimage2 = true;
        } else {
          showimage2 = false;
        }
        if (req.session.currentUser && req.session.currentUser._id === userFromDb.id) {
          showbuttonoffer = false;
        }
        res.render('posts/show', {
          post: post,
          userInSession: req.session.currentUser,
          userFromDb: userFromDb,
          showimage2:showimage2,
          showbuttonoffer:showbuttonoffer
        })
      }).catch(next);
     
    }).catch(next);
  
});



module.exports = router;