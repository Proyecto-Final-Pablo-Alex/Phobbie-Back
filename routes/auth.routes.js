// ---------- IMPORT PACKAGES------------ //
const express = require('express')
const router  = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// ---------- IMPORT DB MODELS ----------- //
const User = require('../models/User.model')

// ---------- ROUTES------------ //
// ---------- Sign Up route------------ //
router.post('/signup', (req, res, next) => {
  const { username, password, age, location, passwordConfirm} = req.body

  if (username === '' || password === '' || age === '' || location === '' || passwordConfirm === "") {
    res.status(200).send({ message: "All the fields are mandatory" })
    return

  } else if (password.length < 6) {
    res.status(200).send({ message: 'The password must be at least 6 digits long' })
    return

  }else if(password !== passwordConfirm){
    res.status(200).send({ message: "Passwords don't match" })
    return

  }else{ 
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.status(200).send({ message: 'This user already exists' })
        return
        
      } else {
        const hashedPassword = bcrypt.hashSync(password, 10)
        User.create({ username, password: hashedPassword, age, location}).then((result) => {
          res.status(201).send({ message: 'User created', result })
        })
      }
    })
    .catch((err) => {
      res.status(400).send({ message: 'Something went wrong' }, err)
    })}
})

// ---------- Log In route------------ //
router.post('/login',(req,res,next) =>{
  passport.authenticate('local', (err, user, failureDetails) => {
    if (err) {
      res.status(400).send({ message: 'Something went wrong with Passport Authentication' })
      return
    }

    if (!user) {
      res.status(400).send({ message: 'This user does not exist', failureDetails })
      return
    }
    res.cookie('sameSite', 'none', {
      sameSite: true,
      secure: true,
    })
    
    req.login(user, (err) => {
      if (err) {
        res.status(400).send({ message: 'Something went bad with req.login', err })
      } else {
        res.status(200).send({ message: 'Log in succesful', user })
      }
    })

  })(req,res,next)
})

// ---------- Logout route------------ //
router.get('/logout', (req, res)=>{
  req.logout()
  res.status(200).send('Logout')
})
  

module.exports = router;
