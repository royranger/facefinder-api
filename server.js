const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const root = require('./controllers/root');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const facecount = require('./controllers/facecount');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'Joy',
    password: '',
    database: 'facefinder'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());


// ROOT
app.get('/', (req, res) => {
  root.getroot(req, res, db);
});

// SIGN IN
app.post('/signin', (req, res) => {
  signin.handleSignin(req, res, db, bcrypt);
});


// REGISTER
app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

// PROFILE
app.get('/profile/:id', (req, res) => {
  profile.getProfile(req, res, db);
});

// IMAGE
app.put('/image', (req, res) => {
  image.handleImage(req, res, db);
} );

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

// FACECOUNT
app.put('/facecount', (req, res) => {
  facecount.handleFaceCount(req, res, db);
});

app.listen(3000, () => {
  console.log('Beep boop! Listening on port 3000!');
});
