const express = require('express');
//const bodyParser = require('body-parser');

const app = express();

app.get('/', (req, res) => {
  res.json('Hello world!');
});


app.listen(3000, () => {
  console.log('Beep boop! Listening on port 3000!');
});


// root -> res = this is working
// signin -> POST, takes req.body.email and req.body.password, res = success/not
// register -> POST, takes req.body.name, email and password. res = new created user
// profile/:userId -> GET userId, res = user
// image -> PUT res: user (with the updated info)
