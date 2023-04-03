const express = require('express');
const mongoose = require('mongoose');
const blogRouter = require('./router/blogs');
const bodyParser = require('body-parser');
const Blog = require('./models/Blog');
const methodOverride = require('method-override');

const app = express();

//connect mongoose
mongoose.connect('mongodb://localhost/crudblog');

// set templating engine
app.set('view engine', 'ejs');

// route for the index
app.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({timeCreated: 'desc'});
  res.render('./index', {blogs: blogs, sample: 'Blog Posts'});
});

app.use(bodyParser.urlencoded())
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.use('/blogs', blogRouter);

app.listen(5000, () => {
  console.log('connected to the server on port 5000');
});