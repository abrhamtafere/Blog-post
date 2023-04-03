const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator')

// initialize mongoose plugin
mongoose.plugin(slug);
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
  },
  timeCreated: {
    type: Date,
    default: ()=>Date.now()
  },
  description: {
    type: String,
  },
  img: {
    type: String,
    default: 'placeholder.jpg'
  },
  slug: {
    type: String, 
    slug: 'title',
    slug_padding_size: 2,
    // unique: true  
    }
});

//const Blogs = mongoose.model('blog', blogSchema);

module.exports = mongoose.model('Blog', blogSchema);