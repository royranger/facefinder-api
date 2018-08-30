const Clarifai = require ('clarifai');

const app = new Clarifai.App({
  apiKey: "bbdd1300524e4d3983c46376b1138687"
});

const handleApiCall = (req, res) => {
  const {input} = req.body;

  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to retrieve data from api'))
};

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
  handleImage: handleImage,
  handleApiCall: handleApiCall
}
