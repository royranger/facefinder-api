const handleImage = (req, res, db) => {
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
};

module.exports = {
  handleImage: handleImage
}
