const graphql = require("graphql");
const sqlite3 = require('sqlite3').verbose();
const { getConditionalString } = require('./filtersHelper');

//create a database if no exists
const database = new sqlite3.Database("./graphql/insurancePlan.db");

const InsurancePlanType = new graphql.GraphQLObjectType({
  name: "InsurancePlan",
  fields: {
    StateCode: { type: graphql.GraphQLString },
    IssuerId: { type: graphql.GraphQLString },
    PlanMarketingName: { type: graphql.GraphQLString },
    PlanType: { type: graphql.GraphQLString },
    MetalLevel: { type: graphql.GraphQLString },
    DiseaseManagementProgramsOffered: { type: graphql.GraphQLString },
    PlanId: { type: graphql.GraphQLString },
    PlanVariantMarketingName: { type: graphql.GraphQLString },
    FirstTierUtilization: { type: graphql.GraphQLString },
    SBCHavingaBabyDeductible: { type: graphql.GraphQLString },
    SBCHavingaBabyCopayment: { type: graphql.GraphQLString },
    SBCHavingaBabyCoinsurance: { type: graphql.GraphQLString },
    SBCHavingaBabyLimit: { type: graphql.GraphQLString },
    SBCHavingDiabetesDeductible: { type: graphql.GraphQLString },
    SBCHavingDiabetesCopayment: { type: graphql.GraphQLString },
    SBCHavingDiabetesCoinsurance: { type: graphql.GraphQLString },
    SBCHavingDiabetesLimit: { type: graphql.GraphQLString },
    SBCHavingSimplefractureDeductible: { type: graphql.GraphQLString },
    SBCHavingSimplefractureCopayment: { type: graphql.GraphQLString },
    SBCHavingSimplefractureCoinsurance: { type: graphql.GraphQLString },
    SpecialtyDrugMaximumCoinsurance: { type: graphql.GraphQLString },
    TEHBDedInnTier1Individual: { type: graphql.GraphQLString },
    TEHBDedInnTier1Coinsurance: { type: graphql.GraphQLString },
    Tobacco: { type: graphql.GraphQLString },
    Age: { type: graphql.GraphQLString },
    IndividualRate: { type: graphql.GraphQLString },
    CoveredPregnancy: { type: graphql.GraphQLString },
    CoveredDepression: { type: graphql.GraphQLString },
    CoveredAsthma: { type: graphql.GraphQLString },
    CoveredLowBackPain: { type: graphql.GraphQLString },
    CoveredWeightLossPrograms: { type: graphql.GraphQLString },
    CoveredHeartDisease: { type: graphql.GraphQLString },
    CoveredPainManagement: { type: graphql.GraphQLString },
    CoveredHighBloodPressureCholesterol: { type: graphql.GraphQLString },
    CoveredDiabetes: { type: graphql.GraphQLString },
    CoveredDiseasesCount: { type: graphql.GraphQLString }
  }
});

const AvgMonthlyPremiumPerStateType = new graphql.GraphQLObjectType({
  name: "AvgMonthlyPremiumPerState",
  fields: {
    StateCode: { type: graphql.GraphQLString },
    AvgMonthlyPremium: { type: graphql.GraphQLFloat }
  }
});

const PriceRangeType = new graphql.GraphQLInputObjectType({
  name: 'PriceRangeType',
  fields: {
    min: { type: graphql.GraphQLInt },
    max: { type: graphql.GraphQLInt }
  }
});

const queries = {
  AvgStatePremium: {
    type: graphql.GraphQLList(AvgMonthlyPremiumPerStateType),
    resolve: (root, context, info) => {
      return new Promise((resolve, reject) => {
        database.all(`SELECT StateCode, round(avg(IndividualRate),2) as AvgMonthlyPremium
                      FROM InsurancePlan
                      GROUP BY StateCode`, function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows);
        });
      });
    }
  },
  AvgStatePremiumByParams: {
    type: graphql.GraphQLList(AvgMonthlyPremiumPerStateType),
    args: {
      Age: {
        type: graphql.GraphQLString
      },
      PlanType: {
        type: graphql.GraphQLList(graphql.GraphQLString)
      },
      CoveredDiseases: {
        type: graphql.GraphQLList(graphql.GraphQLString)
      },
      IndividualRateRange: {
        type: PriceRangeType
      }
    },
    resolve: (root, args, context, info) => {
      return new Promise((resolve, reject) => {
        let conditionalString = getConditionalString(args);
        console.log(">AvgStatePremiumByParams: conditionalString,", conditionalString)
        database.all(`SELECT StateCode, round(avg(IndividualRate),2) as AvgMonthlyPremium
                      FROM InsurancePlan
                      ${conditionalString}
                      GROUP BY StateCode`, function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows);
        });
      });
    }
  },
  FiltersListOfPlan: {
    type: graphql.GraphQLList(InsurancePlanType),
    args: {
      StateCode: {
        type: graphql.GraphQLString
      },
      Age: {
        type: graphql.GraphQLString
      },
      PlanType: {
        type: graphql.GraphQLList(graphql.GraphQLString)
      },
      CoveredDiseases: {
        type: graphql.GraphQLList(graphql.GraphQLString)
      },
      IndividualRateRange: {
        type: PriceRangeType
      }
    },
    resolve: (root, args, context, info) => {
      return new Promise((resolve, reject) => {
        let conditionalString = getConditionalString(args);
        console.log(">FiltersListOfPlan conditionalString,", conditionalString)
        database.all(`SELECT DISTINCT StateCode, PlanType, MetalLevel, Age, CoveredAsthma, CoveredDepression, CoveredDiabetes, CoveredHeartDisease, CoveredHighBloodPressureCholesterol, CoveredLowBackPain, CoveredPainManagement, CoveredPregnancy, CoveredWeightLossPrograms
                      FROM InsurancePlan
                      ${conditionalString}`, function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows);
        });
      });
    }
  },
  CheapestPlans: {
    type: graphql.GraphQLList(InsurancePlanType),
    resolve: (root, context, info) => {
      return new Promise((resolve, reject) => {
        database.all(`SELECT *
                      FROM InsurancePlan
                      GROUP by PlanMarketingName
                      ORDER BY IndividualRate ASC
                      LIMIT 3`, function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows);
        });
      });
    }
  },
  CheapestPlansByParams: {
    type: graphql.GraphQLList(InsurancePlanType),
    args: {
      StateCode: {
        type: graphql.GraphQLString
      },
      Age: {
        type: graphql.GraphQLString
      },
      PlanType: {
        type: graphql.GraphQLList(graphql.GraphQLString)
      },
      CoveredDiseases: {
        type: graphql.GraphQLList(graphql.GraphQLString)
      },
      IndividualRateRange: {
        type: PriceRangeType
      }
    },
    resolve: (root, args, context, info) => {
      return new Promise((resolve, reject) => {
        let conditionalString = getConditionalString(args);
        database.all(`SELECT *
                      FROM InsurancePlan
                      ${conditionalString}
                      GROUP by PlanMarketingName
                      ORDER BY IndividualRate ASC
                      LIMIT 3`, function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows);
        });
      });
    }
  },
  PlansByStateTopThree: {
    type: graphql.GraphQLList(InsurancePlanType),
    args: {
      StateCode: {
        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
      }
    },
    resolve: (root, { StateCode }, context, info) => {
      return new Promise((resolve, reject) => {
        database.all("SELECT * FROM InsurancePlan WHERE StateCode = (?)", [StateCode], function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows.splice(0, 5));
        });
      });
    }
  },
  PlansByStateAndAgeTopThree: {
    type: graphql.GraphQLList(InsurancePlanType),
    args: {
      StateCode: {
        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
      },
      Age: {
        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
      }
    },
    resolve: (root, { StateCode, Age }, context, info) => {
      return new Promise((resolve, reject) => {
        database.all("SELECT * FROM InsurancePlan WHERE StateCode = (?) AND Age = (?)", [StateCode, Age], function (err, rows) {
          if (err) {
            reject(null);
          }
          resolve(rows.splice(0, 5));
        });
      });
    }
  }
}

// create a graphql query to select all and by id
var InsurancePlanQueries = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: {
    AvgStatePremium: queries.AvgStatePremium,
    AvgStatePremiumByParams: queries.AvgStatePremiumByParams,
    CheapestPlans: queries.CheapestPlans,
    CheapestPlansByParams: queries.CheapestPlansByParams,
    FiltersListOfPlan: queries.FiltersListOfPlan,
    PlansByStateTopThree: queries.PlansByStateTopThree,
    PlansByStateAndAgeTopThree: queries.PlansByStateAndAgeTopThree
  }
});


module.exports = InsurancePlanQueries;