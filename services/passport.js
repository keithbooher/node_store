const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
FacebookStrategy = require('passport-facebook').Strategy;
const mongoose = require('mongoose')
const keys = require('../config/keys')

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user)
    })
})

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback',
    proxy: true
  }, 
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ email: profile.emails[0].value })
    if (existingUser) {
      // Already have a record with given profile id
      return done(null, existingUser)
    } 
    let first_name = profile.name.givenName ? profile.name.givenName : null
    let last_name = profile.name.familyName ? profile.name.familyName : null
    let email = profile.emails[0] ? profile.emails[0].value : null
    let photo = profile.photos[0] ? profile.photos[0].value : null

    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()

    // doesn't get run if there is an existing user because of the above return in the if statement 
    const user = await new User({ googleId: profile.id, first_name, last_name, email, photo, joined_on: today }).save()
    done(null, user)
  }
 )
);

passport.use(new FacebookStrategy({
  clientID: keys.facebookClientID,
  clientSecret: keys.facebookClientSecret,
  callbackURL: keys.fb_redirect_uri,
  profileFields: ['email']
},
async (accessToken, refreshToken, profile, done) => {
  console.log(profile)
  const existingUser = await User.findOne({ email: profile.emails[0].value })
  if (existingUser) {
    // Already have a record with given profile id
    return done(null, existingUser)
  } 
  let first_name = profile.name.givenName ? profile.name.givenName : null
  let last_name = profile.name.familyName ? profile.name.familyName : null

  let date = new Date()
  const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
  
  const user = await new User({ facebookId: profile.id, email: profile.emails[0].value, first_name, last_name, joined_on: today  }).save()
  done(null, user)
}
));