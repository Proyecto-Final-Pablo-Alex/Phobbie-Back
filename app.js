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

const User = require('./models/User.model')

// -------- MONGOOSE --------
require('./configs/mongoose.config')


const app = express()
const server = http.createServer(app)

require('./configs/sockets.config')(server)

// Middleware Setup
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// ---------------CORS-----------
app.use(
  cors({
    methods: ['GET', 'POST'],
    credentials: true,
    origin: ['http://localhost:3000'],
  })
)

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
app.use('/', require('./routes/profile.routes'))
app.use('/', require('./routes/hobbies.routes'))
app.use('/', require('./routes/cloudinary.routes'))
app.use('/', require('./routes/friendship.routes'))
app.use('/', require('./routes/chats.routes'))

server.listen(process.env.PORT || 5000, () => {
  console.log(chalk.green.inverse('Puerto activado'))
})
