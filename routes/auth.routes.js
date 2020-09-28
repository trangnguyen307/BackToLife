const express = require('express');
const router  = express.Router();
const bcryptjs = require('bcrypt')
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds)
const mongoose = require('mongoose')
const fileUploader = require('../configs/cloudinary.config');

const User = require('../models/User.model.js')

const routeGuard = require('../configs/route-guard.config');

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
   transactions: '', // to get the numnber of transactions done 
   mypoints: '' // to get the numnber of points collected
 }). then (userFromDb => {
   console.log(transactions.values)
   res.send('user created')
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

// Log in route
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
          res.redirect('/profile');
        } else {
          res.render('auth/login', {errorMessage: 'Incorrect password'})
        }    
}).catch(err=>next(err))

});

router.get('/profile/myprofile', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login')
  }
  
  res.render('profile/myprofile', {userInSession: req.session.currentUser})

})

//TO CHECK
//afficher un profile quelconque avec l'id
router.get('/profile/:profileid', (req, res, next) => {
  User.findOne({_id: req.params.profileid})
    res.render('profile/profile', {user})
  })
  .catch(err => next(err))



router.get('/profile/dashboard', (req, res, next) => {
  if (!req.session.currentUser) {
    res.redirect('/login')
  }
  
  res.render('profile/dashboard', {userInSession: req.session.currentUser})
})




router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
