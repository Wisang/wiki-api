const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();


mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/articles', function(req, res) {
  Article.find(function(err, foundArticles) {
    if (err) {
      res.send(err);
    } else {
      res.send(foundArticles);
    }

  });
});

app.post('/articles', function(req, res) {
  // console.log(req.body.title);
  // console.log(req.body.content);
  const newPost = new Article({
    title: req.body.title,
    content: req.body.content
  });

  newPost.save(function(err) {
    if (err) {
      res.send(err);
    } else {
      res.send(newPost);
    }
  });
});

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
