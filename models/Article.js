//Moment
var moment = require('moment');


//Require Mongoose
var mongoose = require('mongoose');

//Schema Class
var Schema = mongoose.Schema;

//article schema
var ArticleSchema = new Schema({
	//Title of Article
	title: {
		type: String,
		required: true
	},
	//Link to Article
	link: {
		type: String,
		required: true
	},
	

	//Date articlee scraped
	 updated: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm A')
  },

	//Comment model
	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});


// Create Article w/ Mongoose
var Article = mongoose.model('Article', ArticleSchema);

// exporting the model
module.exports = Article;