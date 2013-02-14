var User = require('../models/user');

exports.index = function(req, res){
  if (req.session.user){
    res.redirect('/profile/me');
  } else {
    req.facebook.api('/me', function(err, data){
      var fbid = data.id;
      User.findOne({ fbid : fbid }).exec(function (err, docs) {
        if (err) return console.log('error', err);
        if (docs) {
          req.session.user = docs;
          res.redirect('/profile/me');
        } else {
          var new_user = new User({ fbid: fbid, color:"rgb(227,246,227)" });
          new_user.save(function (err) {
            if (err) return console.log("error", err);
            req.session.user = new_user;
            console.log("new user saved");
            res.redirect('/profile/me');
          });
        }
      });
    });
  }
};

exports.profile = function(req, res){
  if (!req.session.user){
    res.redirect('/');
  }
  var id_req = req.params.user;
  req.facebook.api('/'+id_req+'/picture?redirect=false&type=large', function(err, profpic) {
    req.facebook.api('/'+id_req, function(err, data) {
      res.render('profile', {title: data.name, color:req.session.user.color, profile:data, profpic:profpic.data.url});
    });
  });
};

exports.personalize = function(req, res){
  var id_req = req.params.user;
  req.facebook.api('/'+id_req+'/picture?redirect=false&type=large', function(err, profpic) {
    req.facebook.api('/'+id_req, function(err, data) {
      res.render('profile', {title: data.name, profile:data, profpic:profpic.data.url});
    });
  });
};