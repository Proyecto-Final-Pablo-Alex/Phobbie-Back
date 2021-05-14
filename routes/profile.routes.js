const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('../models/User.model')

router.get('/return-user', (req, res)=>{
  if (req.user) {
    User.findById(req.user._id)
    .populate('hobbies')
    .populate('friends')
    .then((result) => {
      res.send({ message: 'Log in verified', result })
      
    })
    .catch(() => {
      res.send({ message: 'Error verifing the user' })
    })
  } else {
    res.send(req.user)
  }
  res.cookie('sameSite', 'none', {
    sameSite: true,
    secure: true,
  })
})

router.get('/return-friend/:id', (req, res)=>{
  const {id} = req.params
  const filtered = req.user.friends.filter((friend)=>{return (friend == id)})

  if (filtered.length > 0) {
    User.findById(id)
    .populate('hobbies')
    .populate('friends')
    .then((result) => {
      res.send({ message: 'Friend found', result })
      
    })
    .catch(() => {
      res.send({ message: 'Error verifying the user' })
    })
  } else {
    res.send({message: 'You are not friends yet'})
  }
})


router.post('/edit-user', (req, res)=>{
  const {username, _id, password, age, location, photo,status, confirmPassword} = req.body
  if (password === confirmPassword){
  const hashedPassword = bcrypt.hashSync(password, 10)

  User.findByIdAndUpdate(_id, {username, password:hashedPassword, age, location, photo,status}, {new: true})
    .then(user => {
      console.log(user)
      res.send({message: 'Edited succesfully', user})  
    })
    .catch(error => {
      res.send({message: 'Something went wrong', error})
    })
  }else{
    res.send({message: "both passwords must match"})
    }
})

router.post('/delete-user', (req, res)=>{
  const {_id} = req.body
  User.findByIdAndDelete(_id)
    .then(user=> {
      req.logout()
    })
    .catch(error=> {
      res.send({message: 'Something went wrong', error})
    })
})

module.exports = router