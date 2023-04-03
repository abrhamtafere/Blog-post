const express = require('express');
const Blog = require('../models/Blog');
const multer = require('multer');

const router = express.Router();

//define the storage for the images
const storage = multer.diskStorage({
  // destination for files
  destination: function (req, file, callback){
    callback(null, './public/uploads/images');
},
// add back the extension
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname)
  },
});

// upload parameters for the multer
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024*1024*3,
  },
});
  
router.get('/',async (req, res) => {
  let blogs = await Blog.find({});
  res.render('index', {blogs: blogs});
});

router.get('/new', (req, res) => {
  res.render('new');
});

// view route
router.get('/:id', async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if(blog){
    res.render('show', { blog: blog });
  }else{
    res.redirect('/');
  }
});

// route to handle new post
router.post('/', upload.single('image'), async (req, res) => {
  //console.log(req.file);
  let blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    img: req.file.filename,
    // timeCreated: req.body.timeCreated
  });

  try {
    blog = await blog.save();

    res.redirect(`/blogs/${blog.id}`);
  } catch (error) {
    console.log('error ' + error);
  }
});

// route to hadle edit
router.get('/edit/:id', async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  try {
    res.render('edit', {blog: blog});
  } catch (error) {
    console.log('error occure when it tries to edit!')
  }
});

// route to handle update
router.put('/:id', async (req, res) => {
  req.blog = await Blog.findById(req.params.id);
  let blog = req.blog;
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.description = req.body.description;

  try {
    blog = await blog.save();

    res.redirect(`/blogs/${blog.id}`);
  } catch (error) {
    console.log(error);
    res.redirect(`/blogs/edit/${blog.id}`, { blog: blog });
  }
});

// handle delete
router.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

module.exports = router;