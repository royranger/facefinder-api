const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

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


const database = {
  users: [
    {
      id: '123',
      name: 'Ari',
      email: 'ari@gmail.com',
      password: 'green',
      entries: 0,
      faces: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Nate',
      email: 'nate@gmail.com',
      password: 'red',
      entries: 0,
      faces: 0,
      joined: new Date()
    }
  ]
}


// ROOT
app.get('/', (req, res) => {
  db.select().table('users')
  .returning('*')
  .then(users => res.json(users))
  .catch(err => res.status(404).json('users not found'))
});

// SIGN IN
app.post('/signin', (req, res) => {
  const {email, password} = req.body;
  let userFound = false;

  database.users.forEach(user => {
    if (email === user.email && password === user.password) {
      userFound = true;
      res.json(user);
    }
  });

  if (!userFound) {
    res.status(400).json('Incorrect email and/or password.');
  }
});

// REGISTER
app.post('/register', (req, res) => {
  const {name, email, password} = req.body;

  db('users')
  .returning('*')
  .insert({
    name: name,
    email: email,
    joined: new Date()
  })
    .then(newUser => {
      res.json(newUser[0]);
    })
    .catch(err => res.status(400).json('Unable to register'))
});

// PROFILE
app.get('/profile/:id', (req, res) => {
  const {id} = req.params;
  db.select('*').from('users').where({
    id: id
  })
  .then(user => {
    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(404).json('user not found')
    }
  })
});

// IMAGE
app.put('/image', (req, res) => {
  const {id} = req.body;
  db('users')
  .where('id', '=', id)
  .returning('entries')
  .increment('entries', 1)
  .then(entries => {
    if (entries.length) {
      res.json(entries[0]);
    } else {
      res.status(404).json('User not found');
    }
    })
  .catch(err => res.status(400).json('unable to get entries'))
});

// FACECOUNT
app.put('/facecount', (req, res) => {
  const {id, numFaces} = req.body;
  db('users')
  .where('id', '=', id)
  .returning('faces')
  .increment('faces', numFaces)
  .then(faces => {
    if (faces.length) {
      res.json(faces[0]);
    } else {
      res.status(404).json('User not found');
    }
  })
  .catch(err => res.status(400).json('unable to update facecount'))
});

app.listen(3000, () => {
  console.log('Beep boop! Listening on port 3000!');
});
