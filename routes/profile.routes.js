const express = require('express')
const router = express.Router()

const fileUploader = require("../configs/cloudinary.config");

const User = require('../models/User.model')

router.get(`/user-list/:username`, (req, res) => {
  const { username } = req.params

  User.findOne({ username })
    .then((result) => {
      console.log(result)
      res.send({ username: result.username, hobbies: result.hobbies })
    })
    .catch((err) => {
      console.log(err)
      res.send({ message: 'User not found' }, err)
    })
})

router.post('/edit-user', fileUploader.single('photo'), (req, res)=>{
  const {username, _id, password, age, location, actualPhoto} = req.body

  let photo
  if (req.file){
    photo = req.file.path
  }else{
    photo = actualPhoto
  }

  User.findByIdAndUpdate(_id, {username, password, age, location, photo})
    .then(result => {
      User.findById(_id)
        .then(user => {
          res.send({message: 'Edited succesfully', user})  
        })
    })
    .catch(error => {
      res.send({message: 'Something went wrong', error})
    })
    
})

module.exports = router
