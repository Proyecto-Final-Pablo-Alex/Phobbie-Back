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
const http = require('http')
const cookieSession = require('cookie-session')

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

//------------SAMESITE COOKIE-------------//


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
app.use('/', require('./routes/index.routes'))
app.use('/', require('./routes/auth.routes'))
app.use('/', require('./routes/profile.routes'))
app.use('/', require('./routes/hobbies.routes'))
app.use('/', require('./routes/cloudinary.routes'))
app.use('/', require('./routes/friendship.routes'))
app.use('/', require('./routes/chats.routes'))

// ---------- SERVER LISTEN----------- //
app.listen(process.env.PORT || 5000, () => {
  console.log(chalk.green.inverse('Puerto activado'))
})
