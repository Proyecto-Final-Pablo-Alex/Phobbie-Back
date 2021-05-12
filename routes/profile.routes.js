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
})

router.post('/edit-user', (req, res)=>{
  const {username, _id, password, age, location, photo,status} = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

  User.findByIdAndUpdate(_id, {username, hashedPassword, age, location, photo,status}, {new: true})
    .then(user => {
      res.send({message: 'Edited succesfully', user})  
    })
    .catch(error => {
      res.send({message: 'Something went wrong', error})
    })
})

module.exports = router