const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');  // Used for generating random passwords.
const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID:"791041645048-0ttjugd2gg9mcvgiah9qfanii1gsteot.apps.googleusercontent.com",
        clientSecret:"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",
        callbackURL:"http://localhost:8000/users/auth/google/callback",
   },
   
   function(accessToken,refreshToken,profile,done){
       //find a user
       User.findOne({email:profile.emails[0].value}).exec(function(err,user){
          if(err){
              console.log('Error in google strategy-passport',err);
              return;
          }
          console.log(profile);
          if(user){
              // if found, set this user as req.user
              return done(null,user);
          }
          else{
              //if not found, create the user and set it as req.user
              User.create({
                  name:profile.displayName,
                  email:profile.emails[0].value,
                  password:crypto.randomBytes(20).toString('hex')
              },function(err,user){
                    if(err){
                        console.log('Error in creating user',err);
                        return;
                    }
                    else{
                        return done(null,user);
                    }
              });
          }
       });
   }
));

module.exports = passport;