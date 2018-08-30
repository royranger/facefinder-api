const getroot = (req, res, db) => {
  db.select().table('users')
  .returning('*')
  .then(users => res.json(users))
  .catch(err => res.status(404).json('users not found'))
};

module.exports = {
  getroot: getroot
}
