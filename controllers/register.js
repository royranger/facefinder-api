const handleRegister = (req, res, db, bcrypt) => {
  const {name, email, password} = req.body;
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!name || !email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  if (!email.match(mailformat)) {
    return res.status(400).json('email is not valid');
  }

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
}

module.exports = {
  handleRegister: handleRegister
}
