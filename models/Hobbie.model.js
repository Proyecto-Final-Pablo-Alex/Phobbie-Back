// ---------- HOBBIE MODEL CREATION FOR DB------------ //
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const hobbieSchema = new Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, required: true },
    description:{type:String},
    users: [{type: Schema.Types.ObjectId, ref: 'User'}]
  },
  { versionKey: false }
)

const Hobbie = mongoose.model('Hobbie', hobbieSchema)

module.exports = Hobbie
