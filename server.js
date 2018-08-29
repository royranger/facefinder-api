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
  res.json(database.users);
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
  let userFound = false;

  database.users.forEach(user => {
    if (id === user.id) {
      userFound = true;
      res.json(`Welcome, ${user.name}!`);
    }
  });

  if (!userFound) {
    res.status(404).json(`User not found.`);
  }
});

// IMAGE
app.put('/image', (req, res) => {
  const {id} = req.body;
  let userFound = false;

  database.users.forEach(user => {
    if (id === user.id) {
      userFound = true;
      user.entries++;
      res.json(user.entries);
    }
  });
  if (!userFound) {
    res.status(404).json('User not found');
  }
});

// FACECOUNT
app.put('/facecount', (req, res) => {
  const {id, numFaces} = req.body;
  let userFound = false;

  database.users.forEach(user=> {
    if (id === user.id) {
      userFound = true;
      user.faces += numFaces;
      res.json(user.faces);
    }
  });
  if (!userFound) {
    res.status(404).json('User not found')
  }

});

app.listen(3000, () => {
  console.log('Beep boop! Listening on port 3000!');
});
