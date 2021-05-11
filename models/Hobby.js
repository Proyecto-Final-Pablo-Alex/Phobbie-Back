const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hobbySchema = new Schema(
  {
    name: { type: String, required: true },
    sprite: { type: String, required: true },
  },
  { versionKey: false }
)

const Hobby = mongoose.model('Hobby', hobbySchema)

module.exports = Hobby
