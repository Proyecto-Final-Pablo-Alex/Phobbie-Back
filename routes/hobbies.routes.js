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
  Hobbie.findOne({name})
  .then(result => {
    if(!result){
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
    }else{
      res.send({message: 'This hobbie has already been created'})
    }
  })
  .catch(err => {
    res.status(400).send({ message: 'Something went wrong' }, err)
  })
})

router.post('/hobbies/addToMyHobbies', (req, res)=>{
  const {_id, userId} = req.body
  Hobbie.findByIdAndUpdate(_id, {$push: {users: userId}}, {new: true})
  .populate('users')
  .then((updatedHobbie)=>{
    User.findByIdAndUpdate(userId, {$push: {hobbies: updatedHobbie._id}}, {new: true})
    .then((userUpdated)=>{
      res.status(201).send({user: userUpdated, hobbie: updatedHobbie})
    })
  })
  .catch(err=>{
    res.status(400).send({ message: 'Something went wrong' }, err)
  })
})

router.post('/hobbies/removeFromMyHobbies' , (req, res)=>{
  const {_id, userId} = req.body
  User.findByIdAndUpdate(userId, {$pull: {hobbies: _id}}, {new: true})
  .then(userUpdated => {
    Hobbie.findByIdAndUpdate(_id, {$pull: {users: userId}}, {new: true})
    .populate('users')
    .then(updatedHobbie=>{
      res.status(200).send({user: userUpdated, hobbie: updatedHobbie})
    })
  })
  .catch(error => {
    console.log(error)
  })
  
})

router.get('/hobbie-details/:name', (req, res)=>{
  const {name} = req.params
  Hobbie.findOne({name})
  .populate('users')
  .then(hobbie => {
    res.send(hobbie)
  })
  .catch(error => {
    console.log(error)
  })
  
})

module.exports = router