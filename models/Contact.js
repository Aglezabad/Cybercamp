var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contact = new Schema({
	name: String,
	telephone: Number,
	email: String
});

module.exports = mongoose.model('Contact', Contact);