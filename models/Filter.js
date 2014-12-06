var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Filter = new Schema({
	name: String,
	description: String
});

module.exports = mongoose.model('Filter', Filter);