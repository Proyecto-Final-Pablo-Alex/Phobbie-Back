const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const fileUploader = require("../configs/cloudinary.config");

const User = require('../models/User.model')

router.post('/edit-user', fileUploader.single('photo'), (req, res)=>{
  const {username, _id, password, age, location, photo} = req.body

  const hashedPassword = bcrypt.hashSync(password, 10)

  User.findByIdAndUpdate(_id, {username, hashedPassword, age, location, photo}, {new: true})
    .then(user => {
      res.send({message: 'Edited succesfully', user})  
    })
    .catch(error => {
      res.send({message: 'Something went wrong', error})
    })
})

module.exports = router