const express = require('express');
const router  = express.Router();

const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/User.model')

/* POST new user */
router.post('/signup', (req, res, next) => {
    const { username, password, age, location} = req.body
    if (username === '' || password === '' || age === '' || location === '') {
      res.send({ message: "All the fields are mandatory" })
      return
    } else if (password.length < 6) {
      res.send({ message: 'The password must be at least 6 digits long' })
      return
    }else{ 
    User.findOne({ username })
      .then((user) => {
        if (user) {
          res.send({ message: 'This user already exists' })
          return
        } else {
          const hashedPassword = bcrypt.hashSync(password, 10)
          User.create({ username, password: hashedPassword, age, location}).then((result) => {
            res.send({ message: 'User created', result })
          })
        }
      })
      .catch((err) => {
        res.send(err)
      })}
  })

  /* LOG IN */
router.post(
    '/login',(req,res) =>{
        passport.authenticate('local', (err, user, failureDetails) => {
            if (err) {
              res.send({ message: 'Something went wrong with Passport Authentication' })
              return
            }
        
            if (!user) {
              res.send({ message: 'This user does not exist', failureDetails })
              return
            }

            res.cookie('sameSite', 'none', {
              sameSite: true,
              secure: true,
            })
        
            req.login(user, (err) => {
              if (err) {
                res.send({ message: 'Something went bad with req.login', err })
              } else {
                res.send({ message: 'Log in succesful', user })
              }
            })
          })(req,res)
    }
    
  )
  
  
module.exports = router;
