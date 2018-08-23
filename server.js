const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json('Hello world!');
});

app.post('/signin', (req, res) => {
  const {email, password, name} = req.body;
  let userFound = false;

  database.users.forEach(user => {
    if (email === user.email && password === user.password) {
      userFound = true;
      res.json(`Thanks for signing in, ${name}!`);
    }
  });

  if (!userFound) {
    res.json('Incorrent email and/or password.');
  }
});

app.listen(3000, () => {
  console.log('Beep boop! Listening on port 3000!');
});


// root -> res = this is working
// signin -> POST, takes req.body.email and req.body.password, res = success/not
// register -> POST, takes req.body.name, email and password. res = new created user
// profile/:userId -> GET userId, res = user
// image -> PUT res: user (with the updated info)
