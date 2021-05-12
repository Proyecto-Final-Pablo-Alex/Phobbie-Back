const express = require('express')
const router = express.Router()

const Hobbie = require('../models/Hobbie.model')
const User = require('../models/User.model')

router.get(`/hobbies/allHobbies`, (req, res) => {
  Hobbie.find({})
    .then((result) => {
      res.status(200).send({ hobbies: result })
    })
    .catch((err) => {
      res.status(400).send({ message: 'Something went wrong' }, err)
    })
})

router.post('/hobbies/addHobbie', (req, res)=> {
  const {name, photo, description, userId} = req.body
  Hobbie.create({name, photo, description})
  .then(hobbie => {
    Hobbie.findByIdAndUpdate(hobbie._id, {$push: {users: userId}}, {new: true})
    .then((updatedHobbie)=>{
      User.findByIdAndUpdate(userId, {$push: {hobbies: updatedHobbie._id}}, {new: true})
      .then((user)=>{
        res.status(201).send(user)
      })
    })
  })
  .catch(err=> {
    console.log(err)
    res.status(400).send({ message: 'Something went wrong' }, err)
  })
})

module.exports = router