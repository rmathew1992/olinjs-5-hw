var mongoose= require('mongoose');


var schema = mongoose.Schema({
  fbid: Number,
  color: String
});
var User = mongoose.model('User', schema);

module.exports = User;