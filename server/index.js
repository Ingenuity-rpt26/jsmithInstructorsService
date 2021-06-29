/* eslint-disable no-plusplus */
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('../db/index.js');
const schema = require('./graphQLSchema');

const app = express();
const port = 3003;

const root = {
  rollDice: ({ numDice, numSides }) => {
    const output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));

// Request using Postman:

// QUERY:
//   query($dice: Int!, $sides: Int!){
//     rollDice(numDice: $dice, numSides: $sides)
//   }
// GRAPHQL VARIABLES:
// {
//   "dice": 7,
//   "sides": 42
// }
app.use(express.static(path.join(__dirname, '../public')));

app.get('/:courseNumber', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// returns all instructors documents
app.get('/api/allinstructors', (req, res) => {
  db.findAllInstructors((err, dbResponse) => {
    if (err) {
      res.send(err).status(400);
    } else {
      res.send(dbResponse);
    }
  });
});

// returns an array of instructors that belong to a course
app.get('/api/instructors/:courseNumber', (req, res) => {
  db.findInstructors(parseInt(req.params.courseNumber), (dbResponse) => {
    res.send(dbResponse);
  });
});

// returns the primary instructor for a course
app.get('/api/primaryInstructor/:courseNumber', (req, res) => {
  db.findPrimaryInstructor(parseInt(req.params.courseNumber), (dbResponse) => {
    res.send(dbResponse);
  });
});

// returns all offeredBy documents for all courses
app.get('/api/offeredByAll', (req, res) => {
  db.findAllOfferedBys((err, dbResponse) => {
    if (err) {
      res.send(err).status(400);
    } else {
      res.send(dbResponse);
    }
  });
});

// returns the offeredBy for a course
app.get('/api/offeredBy/:courseNumber', (req, res) => {
  db.findOfferedBy(parseInt(req.params.courseNumber), (dbResponse) => {
    res.send(dbResponse);
  });
});

// returns three random testimonials
app.get('/api/testimonials/:courseNumber', (req, res) => {
  db.findTestimonials(parseInt(req.params.courseNumber), (dbResponse) => {
    res.send(dbResponse);
  });
});

app.listen(port, () => {
  console.log(`Instructors service listening at http://localhost:${port}`);
});
