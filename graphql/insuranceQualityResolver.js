const graphql = require("graphql");
const sqlite3 = require('sqlite3').verbose();

//create a database if no exists
const database = new sqlite3.Database("./graphql/healthcareQuality.db");

//create graphql post object
const InsuranceQualityType = new graphql.GraphQLObjectType({
  name: "InsuranceQuality",
  fields: {
    State: { type: graphql.GraphQLString },
    Code: { type: graphql.GraphQLString },
    ARankHospitalsPercentage: { type: graphql.GraphQLString },
    WalletHubCompositeScore: { type: graphql.GraphQLFloat },
    USNewsRank: { type: graphql.GraphQLInt },
    HCAccess: { type: graphql.GraphQLInt },
    HCCareQuality: { type: graphql.GraphQLInt },
    PublicHealth: { type: graphql.GraphQLInt },
    LowMortalityRate: { type: graphql.GraphQLInt },
    LowInfantMortalityRate: { type: graphql.GraphQLInt },
    LowObesityRate: { type: graphql.GraphQLInt },
    LowSmokingRate: { type: graphql.GraphQLInt },
    LowSuicideRate: { type: graphql.GraphQLInt }
  }
});

const queries = {
  InsuranceQuality: {
    type: graphql.GraphQLList(InsuranceQualityType),
    resolve: (root, context, info) => {
      return new Promise((resolve, reject) => {
        database.all("SELECT * FROM HealthcareQuality", function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows);
        });
      });
    }
  },
  InsuranceQualityTopFive: {
    type: graphql.GraphQLList(InsuranceQualityType),
    args: {
      Code: {
        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
      }
    },
    resolve: (root, { Code }, context, info) => {
      return new Promise((resolve, reject) => {
        database.all("SELECT * FROM HealthcareQuality WHERE Code = (?)", [Code], function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows.splice(0, 5));
        });
      });
    }
  }
}

// create graphql query
var InsuranceQualityQueries = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    // Select all
    InsuranceQuality: queries.InsuranceQuality,
    // Select by state code
    InsuranceQualityTopFive: queries.InsuranceQualityTopFive
  }
});

module.exports = InsuranceQualityQueries;