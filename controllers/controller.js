// Dependencies
var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping

// Comment and Article models
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

router.get('/', function(req, res) {

    
    res.redirect('/scrape');

});



router.get('/articles', function(req, res) {

    Article.find().sort({ _id: -1 })

    .populate('comments')
    .exec(function(err, doc) {
        // log errors
        if (err) {
            console.log(err);
        }
        
        else {
            var hbsObject = { articles: doc }
            res.render('index', hbsObject);
           
        }
    });

});


// Web Scrape Route
router.get('/scrape', function(req, res) {


    request('http://www.theonion.com/', function(error, response, html) {

        // Load to Cheerio
        var $ = cheerio.load(html);

        var titlesArray = [];
        
        $('article .inner').each(function(i, element) {

            // Empty result object
            var result = {};

            // Article Title result.title = $(this).children('header').children('h2').text().trim() + ""; //convert to string for error handling later

            // Article Link 
            result.link = 'http://www.theonion.com' + $(this).children('header').children('h2').children('a').attr('href').trim();

            // Article summary
            result.summary = $(this).children('div').text().trim() + ""; //convert to string for error handling later


            // Error handling to ensure there are no empty scrapes
            if (result.title !== "" && result.summary !== "") {

                //Issue with Onion saving dups
                if (titlesArray.indexOf(result.title) == -1) {

                    titlesArray.push(result.title);
Article.count({ title: result.title }, function(err, test) {

                        if (test == 0) {

                            // Using the Article model, create a new entry (note that the "result" object has the exact same key-value pairs of the model)
                            var entry = new Article(result);

                            // Save the entry to MongoDB
                            entry.save(function(err, doc) {
                                // log any errors
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log(doc);
                                }
                            });

                        }
                        else {
                            console.log('Redundant Database Content. Not saved to DB.')
                        }

                    });
                }
                else {
                    console.log('Redundant Onion Content. Not Saved to DB.')
                }

            }
            else {
                console.log('Empty Content. Not Saved to DB.')
            }

        });
        res.redirect("/articles");

    });

});


//API
router.post('/add/comment/:id', function(req, res) {
    //Article ID
    var articleId = req.params.id;
    //Author Name
    var commentAuthor = req.body.name;
    // Comment Conent
    var commentConnent = req.body.comment;

    // Results of Comment model
    var result = {
        author: commentAuthor,
        content: commentContent
    };

    //Create entry
    var entry = new Comment(result);

    //Save
    entry.save(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            Article.findOneAndUpdate({ '_id': articleId }, { $push: { 'comments': doc._id } }, { new: true })
            exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});

//Delete
router.post('/remove/comment/:id', function(res, req) {
    var commendId = req.params.id;

    Comment.findByIdAndRemove(commentId, function(err, todo) {
        if (err) {
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    });
});

// Export Router
module.exports = router;
