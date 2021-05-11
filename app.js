require('dotenv').config()

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const chalk = require('chalk')

const bcrypt = require('bcryptjs')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// -------- MONGOOSE --------
require('./configs/mongoose')

const app = express()

// Middleware Setup
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// -------- PASSPORT --------
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
)

//PASO 4: Configurar la serializacion del usuario.
passport.serializeUser((user, callback) => {
  callback(null, user._id)
})

//PASO 5: Configurar la deserializacion del usuario.
passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((result) => {
      callback(null, result)
    })
    .catch((err) => {
      callback(err)
    })
})

//PASO 6: Configurar el middleware de flash
app.use(flash())

//PASO 7: Configurar el middleware del Strategy.
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
            //si el usuario no existe
            return next(null, false, { message: `incorrect username` })
          }
          if (!bcrypt.compareSync(password, user.password)) {
            //Si la contraseña no coincide
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

//PASO 10: Configurar middleware de passport
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/index.routes'))
app.use('/', require('./routes/auth.routes'))

app.listen(process.env.PORT || 5000, () => {
  console.log(chalk.green.inverse('Puerto activado'))
})
