const express = require('express');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const app = express();

// Valores Facebook Developers
const FACEBOOK_APP_ID = 'exemplo123456789';
const FACEBOOK_APP_SECRET = 'exemploaleatóriodaaidjaskdu';
const FACEBOOK_CALLBACK_URL = 'http://localhost:3455/auth/facebook/callback';

app.use(
  require('express-session')({
    secret: 'chave',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function (accessToken, refreshToken, profile, cb) {
      const user = {
        id: profile.id,
        name: profile.displayName || 'Nome não disponível',
        username: profile.emails ? profile.emails[0].value : 'Email não disponível',
      };
      return cb(null, user);
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  cb(null, user);
});

app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/profile', failureRedirect: '/login' })
);

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Bem-vindo, ${req.user.name}!`);
  } else {
    res.redirect('/auth/facebook');
  }
});

app.listen(3455, () => {
  console.log('Servidor rodando em http://localhost:3455');
});
