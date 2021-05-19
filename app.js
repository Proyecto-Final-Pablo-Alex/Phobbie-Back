// ---------- IMPORT PACKAGES ----------- //
require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const chalk = require('chalk')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const path = require ('path')

// ---------- IMPORT DB MODELS ----------- //
const User = require('./models/User.model')


// -------- MONGOOSE --------
require('./configs/mongoose.config')

//  -----------SERVER --------//
const app = express()

// ---------- MIDDLEWARE ----------- //
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

//------------PUBLIC CONFIGURATION-------------//

app.use(express.static(path.join(__dirname, 'public')))

// ---------------CORS-----------//
app.use(
  cors({
    methods: ['GET', 'POST'],
    credentials: true,
    origin: ['http://localhost:3000'],
  })
)

// -------- PASSPORT --------//
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
)

passport.serializeUser((user, callback) => {
  callback(null, user._id)
})

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((result) => {
      callback(null, result)
    })
    .catch((err) => {
      callback(err)
    })
})

app.use(flash())

passport.use(
  new LocalStrategy(
    {
      usernameField: `username`,
      passwordField: `password`,
      passReqToCallback: true,
    },
    (req, username, password, next) => {
      User.findOne({ username })
        .then((user) => {

          if (!user) {
            return next(null, false, { message: `Incorrect username` })
          }

          if (!bcrypt.compareSync(password, user.password)) {
            return next(null, false, { message: `Incorrect password` })
          }
          
          return next(null, user)
        })
        .catch((err) => {
          next(err)
        })
    }
  )
)

app.use(passport.initialize())
app.use(passport.session())

// ---------- IMPORT ROUTE FILES ----------- //
app.use('/sv', require('./routes/index.routes'))
app.use('/sv', require('./routes/auth.routes'))
app.use('/sv', require('./routes/profile.routes'))
app.use('/sv', require('./routes/hobbies.routes'))
app.use('/sv', require('./routes/cloudinary.routes'))
app.use('/sv', require('./routes/friendship.routes'))
app.use('/sv', require('./routes/chats.routes'))

//----------FRONTEND CONNECTION-----------///
app.use((req,res,next)=>{
  res.sendFile(__dirname+"/public/index.html")
  })

// ---------- SERVER LISTEN----------- //
app.listen(process.env.PORT || 5000, () => {
  console.log(chalk.green.inverse('Puerto activado'))
})
