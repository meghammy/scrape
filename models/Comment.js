//Require Mongoose
var mongoose = require('mongoose');

//Create Schema Class
var Schema = mongoose.Schema;


//creating the comment schema
var CommentSchema = new Schema({
	
	// Author's Name
	author: {
		type: String
	},
	// Comment Content
	content: {
		type:String
	}
});

// Comment model with mongoose
var Comment = mongoose.model('Comment', CommentSchema);

//Export the Model
module.exports = Comment;
