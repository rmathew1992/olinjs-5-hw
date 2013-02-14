
/*
 * GET users listing.
 */
var User = require('../models/user');

exports.personalize = function(req, res){
  if (req.session.user){
    var user = req.session.user;
    User.update({ fbid: user.fbid }, { $set: { color: req.body.color }}).exec();
    req.session.user.color = req.body.color;
    res.redirect('/');
  } else {
    res.redirect('/');
  }
};

