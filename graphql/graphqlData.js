const graphql = require("graphql");
const InsurancePlanQueries = require('./insurancePlanResolver');
const InsuranceQualityQueries = require('./insuranceQualityResolver');

//define schema with InsuranceQuality object, queries
const insuranceQualitySchema = new graphql.GraphQLSchema({
  query: InsuranceQualityQueries
});

const insurancePlanSchema = new graphql.GraphQLSchema({
  query: InsurancePlanQueries
});

//export schema to use on index.js
module.exports = {
  schema: {
    insuranceQuality: insuranceQualitySchema,
    insurancePlans: insurancePlanSchema
  }
}