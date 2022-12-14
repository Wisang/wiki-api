const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();
const _ = require('lodash');


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

// for specific article

app.route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("no article found");
      }
    });
  })

  .put(function(req, res) {
    Article.findOneAndUpdate(
      {
        title: req.params.articleTitle
      },
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        overwrite: false
      },
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("successfully updated");
        }
      }
    );
  })

  .patch(function(req,res){
    Article.findOneAndUpdate(
      {
        title: req.params.articleTitle
      },
      {
        $set: req.body
      },
      function(err) {
        if (err) {
          res.send(err);
        }
        else {
          res.send("successfully patched");
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne(
      {title: req.params.articleTitle},
      function(err) {
        if (err) {
          res.send(err);
        } else {
          res.send("successfully deleted one");
        }
      }
    );
  });

app.listen(3000, function() {
  console.log("Listening on port 3000");
});
