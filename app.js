const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const Restaurant = require('./models/restaurant')

const app = express()

// template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))

// mongoose connect to mongoDB
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
// connecting error
db.on('error', () => {
  console.log('mongodb error!')
})
// connecting success
db.once('open', () => {
  console.log('mongodb connected!')
})

// route setting
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  console.log(req.body)
  const addItem = req.body
  return Restaurant.create({
    name: addItem.name,
    category: addItem.category,
    image: addItem.image,
    location: addItem.location,
    phone: addItem.phone,
    google_map: addItem.google_map,
    rating: addItem.rating,
    description: addItem.description,
  })
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))

})

// setting port
app.listen(3000, () => {
  console.log(`App is running on http://localhost:3000`)
})

app.use(express.static('public'))