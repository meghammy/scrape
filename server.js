//Require dependencies
var express = require('express');

var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');


var mongoose = require('mongoose');

// var logger = require('morgan'); //debugging

//Web Scraping
var request = require('request'); 
var cheerio = require('cheerio'); 

// Initialize Express
var app = express();
// app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

// Static Content
app.use(express.static(process.cwd() + '/public'));

//EXPHBS
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');



if(process.env.NODE_ENV == 'production') {
	mongoose.connect("mongodb://herokuXXXXXXX")
}
else{
	mongoose.connect('mongodb://localhost/scraper');
}
var db = mongoose.connection;

//Mongoose Errors
db.on('error', function(err) {
	console.log('Mongoose Error: ', err);
});

//Mongoose success
db.once('open', function() {
	console.log('Mongoose connection success!');
});

var Comment = require('./models/Comment.js');
var Article = require('./models/Article.js');

// Routes
var router = require('./controllers/controller.js')
app.use('/', router);

app.listen(3000, function() {
	console.log("App running on port 3000");
});

