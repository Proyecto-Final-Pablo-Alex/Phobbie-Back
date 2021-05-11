const express = require('express')
const router = express.Router()

const User = require('../models/User.model')
const Hobbie = require('../models/Hobbie.model')

router.get(`/hobbies/allHobbies`, (req, res) => {
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

router.post('/hobbies/addHobbie', (req, res)=> {
  
})

module.exports = router