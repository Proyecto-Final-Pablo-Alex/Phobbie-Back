const express = require('express')
const router = express.Router()

const Hobbie = require('../models/Hobbie.model')

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
  Hobbie.create(req.body)
  .then(result => {
    res.status(201).send({hobbie: result})
  })
  .catch(err=> {
    res.status(400).send({ message: 'Something went wrong' }, err)
  })
})

module.exports = router