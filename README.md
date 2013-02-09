#olinjs - 5 homework

Shitty MyFaceBookSpace

## Reading

The [facebook-node-sdk](https://github.com/amachang/facebook-node-sdk) is the one we recommend using since it's the same one we played around with in class.

It should be making calls using the [Facebook Graph API](http://developers.facebook.com/docs/reference/api/)

## Assignment

This week we're gonna go ahead and roll out the best mix of MySpace and Facebook ever. Remember how you could do funky stuff like change around your own page layout on MySpace? Well we're gonna make that cool again.

From now on, we're will be more freeform in our assignment layouts. You guys should know enough by now to figure out how to structure your routes. So, at a high level we want to be able to see
* I can log in with Facebook.
* Once I log in with Facebook, I can see my own profile image.
* I can do some stuff to save how I want my own page to be like, such as background color, text size, etc. Do whatever you want for this.
* I can log out without dumping my cache.
* If I log in again, I want to see my beautiful homepage again. 
* Push to Heroku when you're done 
  * Don't forget to change the URL endpoint that is in your Facebook App settings from localhost to your Heroku url
* Add the link [on the Homework sheet](https://docs.google.com/spreadsheet/ccc?key=0AjqGw-pw5UuudFhQSmJhZlRZWEhRTWcwYmxBVld6c1E#gid=6)

**Note**: It is not a requirement to push any changes over to Facebook at this time, only that you can log in using Facebook and pull down information. Though if you want to be adventurous you can do it. 

If you made this in the 90's you'd be a billionare.

## Super secret hint about logging out

We've determined that writing some custom express middleware is probably the way you wanna go. Unless you found an easier way that makes sense. You should tell us if you did.

Remember `Facebook.loginRequired()`? Well that's a middleware. It's saying that before we do our usual routing function, we want our user to login via Facebook. We can extend this principle to checking that people are logged in before every route call. We want our custom middleware to
* check if someone is logged in or not
* redirect to a main page if people aren't logged in

The Facebook-node-sdk has a function called `req.facebook.getUser` that we can use to find the currently logged in user. Put this in your `app.js` file:

```js
function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.send("you need to login");
      } else {
        req.user = user;
        next();
      }
    });
  }
}
```

Now we can call this function like the following

```js
app.get('/test', facebookGetUser(), function(req, res){
    res.send("hello there", req.user);
});
```

Now in order to logout, we can have something like 

```js
app.get('/logout', facebookGetUser(), function(req, res){
  req.user = null;
  req.session.destroy();
  res.redirect('/');
});
```

Now every function that we call that requires a logged in user should call the `facebookGetUser` middleware before our own routing functions. This tells people to login if they're not. Now `Facebook.loginRequired` should only be called on our `/login` route.

```js
app.get('/login', Facebook.loginRequired(), function(req, res){
  res.redirect('/');
});
```

## Still lost? You're almost there!

There's one homework left, due Tuesday. Also, if you have questions about Facebook permissions or posting data to Facebook, check it out:

**<https://github.com/olinjs/olinjs-6-hw>**
