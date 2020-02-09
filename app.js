const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')

const app = express()

// const project = require('./app/routes/project.route.js')
const products = require('./app/routes/product.route')
const orders = require('./app/routes/order.route')

mongoose.connect(
  `mongodb+srv://admin:${process.env.MONGO_ATLAS_PW}@cluster0-vzro8.mongodb.net/test?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)

app.use(logger('dev'))
app.use('/uploads', express.static('uploads')); // make the route '/uploads' can be access by everyone
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATH, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})

//Routes
app.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'You requested homepage'
  })
})

// app.use('/project', project)
app.use('/products', products)
app.use('/orders', orders)

app.use((req, res, next) => {
  const err = new Error('Not found!')
  err.status = 404
  next(err)
})

app.use((error, req, res, next) => {
  const status = error.status || 500

  res.status(status).json({
    error: {
      message: error.message
    }
  })
})

module.exports = app