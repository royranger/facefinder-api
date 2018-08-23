const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


const database = {
  users: [
    {
      id: '123',
      name: 'Ari',
      email: 'ari@gmail.com',
      password: 'green',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Nate',
      email: 'nate@gmail.com',
      password: 'red',
      entries: 0,
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
  const {email, password, name} = req.body;
  let userFound = false;

  database.users.forEach(user => {
    if (email === user.email && password === user.password) {
      userFound = true;
      res.json(user);
    }
  });

  if (!userFound) {
    res.status(400).json('Incorrent email and/or password.');
  }
});

// REGISTER
app.post('/register', (req, res) => {
  const {name, email, password} = req.body;

  const newUser = {
    id: '125',
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  };
  database.users.push(newUser);
  res.json(newUser);
});


app.listen(3000, () => {
  console.log('Beep boop! Listening on port 3000!');
});


// root -> res = this is working
// signin -> POST, takes req.body.email and req.body.password, res = success/not
// register -> POST, takes req.body.name, email and password. res = new created user
// profile/:userId -> GET userId, res = user
// image -> PUT res: user (with the updated info)
