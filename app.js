const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const blogRoutes = require('./routes/blogRoutes');
const { render } = require('ejs');

// connect to mongoDB
const dbURI =
  `mongodb+srv://${process.env.MONGO_DB_USR}:${process.env.MONGO_DB_PWD}@${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

// listen for requests
mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.err(err));

// express app
const app = express();

// register view engine
app.set('view engine', 'ejs');

// middleware for static files (css, image, …)
app.use(express.static('public'))
// middleware for accepting form data 
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.redirect('/blogs')
})

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' })
})

// blog routes with scope ('/blogs')
app.use('/blogs', blogRoutes)

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});