const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hobbySchema = new Schema(
  {
    name: { type: String, required: true },
    foto: { type: String, required: true },
    description:{type:String},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  { versionKey: false }
)

const Hobby = mongoose.model('Hobby', hobbySchema)

module.exports = Hobby
