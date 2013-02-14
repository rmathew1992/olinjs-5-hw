
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , Facebook = require('facebook-node-sdk');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser('coffee'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId:478167148897467, secret:'bfdf48de5501312d8ebfd254f95c2d01' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.methodOverride());
});

app.configure('development', function(){
  app.use(express.errorHandler());
  mongoose.connect(process.env.MONGOLAB_URI || 'localhost');
});

function FindUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.send("you need to <a href='/login'>login</a>");
      } else {
        req.user = user;
        next();
      }
    });
  }
}

app.get('/', FindUser(), routes.index);
app.get('/login', Facebook.loginRequired(), function(req, res){
  res.redirect('/');
});
app.post('/users/personalize', user.personalize);
app.get('/profile/:user', FindUser(), routes.profile);
app.get('/login', Facebook.loginRequired(), function(req, res){
  res.redirect('/');
});
app.get('/logout', FindUser(), function(req, res){
  req.user = null;
  req.session.destroy();
  res.redirect('/');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});