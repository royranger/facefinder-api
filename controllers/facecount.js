const handleFaceCount = (req, res, db) => {
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
};

module.exports = {
  handleFaceCount: handleFaceCount
}
