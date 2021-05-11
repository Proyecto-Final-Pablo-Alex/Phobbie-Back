const express = require('express')
const router = express.Router()

const Hobbie = require('../models/Hobbie.model')

router.get(`/hobbies/allHobbies`, (req, res) => {
  Hobbie.find({})
    .then((result) => {
      res.send({ hobbies: result })
    })
    .catch((err) => {
      res.send({ message: 'Something went wrong' }, err)
    })
})

router.post('/hobbies/addHobbie', (req, res)=> {
  Hobbie.create(req.body)
  .then(result => {
    res.send({hobbie: result})
  })
  .catch(err=> {
    res.send({ message: 'Something went wrong' }, err)
  })
})

module.exports = router