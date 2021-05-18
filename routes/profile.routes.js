// ---------- IMPORT PACKAGES ----------- //
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// ---------- IMPORT DB MODELS ----------- //
const User = require('../models/User.model')

// ---------- ROUTES ----------- //
// ---------- Get all the logged user info from DB route ----------- //
router.get('/return-user', (req, res)=>{

  if (req.user) {
    User.findById(req.user._id)
      .populate('hobbies')
      .populate('friends')
      .then((result) => {
        res.status(200).send({ message: 'Log in verified', result })
        
      })
      .catch((error) => {
        res.status(400).send({ message: 'Error verifing the user', error})
      })

  } else {
    res.cookie('sameSite', 'none', {
      sameSite: true,
      secure: true,
    })
    res.status(200).send(req.user)
  }

})

// ---------- Get an specific friend info from the DB route ----------- //
router.get('/return-friend/:id', (req, res)=>{
  const {id} = req.params
  const filtered = req.user.friends.filter((friend)=>{return (friend == id)})

  if (filtered.length > 0) {
    User.findById(id)
      .populate('hobbies')
      .populate('friends')
      .then((result) => {
        res.status(200).send({ message: 'Friend found', result })
        
      })
      .catch((error) => {
        res.status(400).send({ message: 'Error verifying the user', error })
      })
  } else {
    res.status(400).send({message: 'You are not friends yet'})
  }
})

// ---------- Edit the user profile route ----------- //
router.post('/edit-user', (req, res)=>{
  const {username, _id, password, age, location, photo,status, confirmPassword} = req.body

  if (password === confirmPassword){
  const hashedPassword = bcrypt.hashSync(password, 10)

  User.findByIdAndUpdate(_id, {username, password:hashedPassword, age, location, photo,status}, {new: true})
    .then(user => {
      res.status(200).send({message: 'Edited succesfully', user})  
    })
    .catch(error => {
      res.status(400).send({message: 'Something went wrong', error})
    })

  }else{
    res.status(400).send({message: "Both passwords must match"})
    }
})

// ---------- Delete user from the DB route ----------- //
router.post('/delete-user', (req, res)=>{
  const {_id} = req.body

  User.findByIdAndDelete(_id)
    .then(user=> {
      req.logout()
    })
    .catch(error=> {
      res.status(400).send({message: 'Something went wrong', error})
    })
})

module.exports = router