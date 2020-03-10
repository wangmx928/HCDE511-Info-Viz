module.exports = {
  getConditionalString: ({ StateCode, Age, PlanType = [], CoveredDiseases = [], IndividualRateRange = { min: null, max: null } }) => {
    let conditionalStatements = [];
    if (StateCode) {
      conditionalStatements.push(`(StateCode = "${StateCode}")`)
    }
    if (Age) {
      conditionalStatements.push(`(Age = "${Age}")`)
    }
    if (PlanType && PlanType.length > 0) {
      let typeRange = PlanType.map((type) => {
        return `"${type}"`;
      }).join(",");
      conditionalStatements.push(`(PlanType IN (${typeRange}))`)
    }
    if (CoveredDiseases && CoveredDiseases.length > 0) {
      const MATCHING_NAME = {
        "Pregnancy": "CoveredPregnancy",
        "Depression": "CoveredDepression",
        "Asthma": "CoveredAsthma",
        "Low Back Pain": "CoveredLowBackPain",
        "Weight Loss Programs": "CoveredWeightLossPrograms",
        "Heart Disease": "CoveredHeartDisease",
        "Pain Management": "CoveredPainManagement",
        "High Blood Pressure & Cholesterol": "CoveredHighBloodPressureCholesterol",
        "Diabetes": "CoveredDiabetes"
      };
      let condition = CoveredDiseases.map((diseaseName) => {
        return `${MATCHING_NAME[diseaseName]} = "True"`
      }).join(" AND ")

      conditionalStatements.push(`(${condition})`)
    }
    if (IndividualRateRange.min) {
      conditionalStatements.push(`(IndividualRate > ${IndividualRateRange.min})`)
    }
    if (IndividualRateRange.max) {
      conditionalStatements.push(`(IndividualRate < ${IndividualRateRange.max})`)
    }

    if (conditionalStatements.length) {
      return "WHERE " + conditionalStatements.join(" AND ");
    }
    return "";
  }
};