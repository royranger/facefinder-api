const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
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
  db.select('email', 'hash').from('login')
  .where('email', '=', email)
  .then(data => {
    const isValid = bcrypt.compareSync(password, data[0].hash);
    if (isValid) {
      return db.select('*').from('users')
      .where('email', '=', email)
      .then(newUser => {
        res.json(newUser[0])
      })
      .catch(err => res.status(400).json('unable to get user'))
    } else {
      res.status(400).json('wrong email or password');
    }
  })
  .catch(err => res.status(400).json('wrong email or password'))
});

// REGISTER
app.post('/register', (req, res) => {
  const {name, email, password} = req.body;

  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
          name: name,
          email: loginEmail[0],
          joined: new Date()
        })
          .then(newUser => {
            res.json(newUser[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
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
