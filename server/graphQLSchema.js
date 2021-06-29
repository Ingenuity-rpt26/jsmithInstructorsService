const { buildSchema } = require('graphql');

const schema = buildSchema(
  `
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
  `,
);

module.exports = schema;
