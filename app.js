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

app.route('/articles')
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (err) {
        res.send(err);
      } else {
        res.send(foundArticles);
      }
    });
  })
  .post(function(req, res) {
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
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.send("successfully deleted all the articles");
      }
    });
  });

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
