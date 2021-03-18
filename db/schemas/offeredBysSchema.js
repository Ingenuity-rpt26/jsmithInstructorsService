const mongoose = require('mongoose');
const { Schema } = mongoose;

const offeredBysSchema = new Schema({
  id: Number,
  offeredByIndex: Number,
  offeredByName: String,
  offeredByDescription: String
});

module.exports = offeredBysSchema;