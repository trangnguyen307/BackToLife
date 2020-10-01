const express = require('express');
const router  = express.Router();
const bcryptjs = require('bcrypt')
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds)
const mongoose = require('mongoose')
const fileUploader = require('../configs/cloudinary.config');
const Post = require('../models/Post.model');
const User = require('../models/User.model.js')

const routeGuard = require('../configs/route-guard.config');
const Offer = require('../models/Offer.model');

/* GET Signup */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', fileUploader.single('photo'),(req, res,next)=> {
  console.log('values', req.body)
  const plainPassword = req.body.password
  const hashed = bcryptjs.hashSync(plainPassword,salt )
  console.log('hashed=', hashed)

 User.create({
   username: req.body.username, 
   myphoto: req.file.path,
   email: req.body.email,
   city: req.body.city,
   mydescription: req.body.mydescription,
   passwordHash: hashed,
   //transactions: '', // to get the numnber of transactions done 
   //mypoints: '' // to get the numnber of points collected
 }). then (userFromDb => {
   //res.send('user created')
   res.redirect('/login')
 }).catch(err => {
   console.log('💥 ', err);
 
    if (err instanceof mongoose.Error.ValidationError || err.code === 11000) {
    // re-afficher le formulaire

    console.log('Error de validation mongoose !')

    res.render('auth/signup', {
      errorMessage: 'Username and email not available'
    })
    } else {
    next(err) // hotline
    }
  })
})




//
// Log in route
//

router.get('/login', (req,res,next) => {
  res.render('auth/login')
})

router.post('/login',(req,res,next) => {
  const {email,password} = req.body;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  } 

  User.findOne({email})
    .then(user => {
      if(!user) {
        res.render('auth/login',  {errorMessage:'Email is not registered. Want to sign up?'})
        return; 
      }
        if (bcryptjs.compareSync(password,user.passwordHash)) {
          req.session.currentUser = user;
          res.redirect('/profile/myprofile');
        } else {
          res.render('auth/login', {errorMessage: 'Incorrect password'})
        }    
}).catch(err=>next(err))

});



//
//Profile's route
//
router.get('/profile/myprofile', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login')
  }
    Post.find({creatorId:req.session.currentUser._id}).sort({"createdAt": -1})
      .then(postsFromDb => {
        res.render('profile/myprofile', {
          posts : postsFromDb,
          userInSession: req.session.currentUser
        });
  
      })
      .catch(next);
  // res.render('profile/myprofile', {userInSession: req.session.currentUser})

})

router.get('/profile/dashboard', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login')
  }
  Offer.find({$or: [{creatorId:req.session.currentUser._id},{authorId:req.session.currentUser._id}]}).then(offers=> {
    console.log(offers)
    res.render('profile/dashboard', {
      userInSession: req.session.currentUser,
      offers: offers,
    })
  }) .catch(next); 
});

router.post('/profile/dashboard', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login')
  }
  


});

//Afficher le profile d'un user quelconque
router.get('/profile/:profileid', (req, res, next) => {
  User.findOne({_id: req.params.profileid})
  .then(user => {
    res.render('profile/profile', {user})
  }).catch(err => next(err))
  })





router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
