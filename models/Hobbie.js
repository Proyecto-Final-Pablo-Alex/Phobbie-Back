const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hobbieSchema = new Schema(
  {
    name: { type: String, required: true },
    foto: { type: String, required: true },
    description:{type:String},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  { versionKey: false }
)

const Hobbie = mongoose.model('Hobby', hobbySchema)

module.exports = Hobbie
