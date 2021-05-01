const Promise = require('bluebird');
const { InstructorsModel } = require('../models.js');

const setInstructor = Promise.promisify((id, update, cb) => {
  InstructorsModel.findByIdAndUpdate(id, update, { new: true })
    .then((results) => {
      cb(null, results);
    })
    .catch((err) => cb(err));
});

module.exports = setInstructor;