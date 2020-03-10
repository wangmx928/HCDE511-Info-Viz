import axios from "axios";
import { endpoints } from "./constants";

export const getAvgMonthlyPremiumByParams = async params => {
  const res = await axios.post(endpoints.insurancePlans, {
    crossDomain: true,
    query: `query getAvgStatePremiumByParams ($Age: String, $PlanType: [String], $CoveredDiseases: [String], $IndividualRateRange: PriceRangeType) {
          AvgStatePremiumByParams ( Age: $Age, PlanType: $PlanType, CoveredDiseases: $CoveredDiseases, IndividualRateRange: $IndividualRateRange) {
            StateCode
            AvgMonthlyPremium
          }}`,
    variables: {
      Age: params.age,
      PlanType: params.planType,
      CoveredDiseases: params.coveredDiseasesProgramsPrograms,
      IndividualRateRange: params.price
    }
  });
  console.log("> getAvgMonthlyPremiumByParams: Has data returned");
  return res.data.data.AvgStatePremiumByParams;
};

export const getCheapestPlans = async params => {
  const res = await axios.post(endpoints.insurancePlans, {
    crossDomain: true,
    query: `query getCheapestPlansByParam ($StateCode: String, $Age: String, $PlanType: [String], $CoveredDiseases: [String], $IndividualRateRange: PriceRangeType ){\n    CheapestPlansByParams (StateCode:$StateCode, Age: $Age, PlanType: $PlanType, CoveredDiseases: $CoveredDiseases, IndividualRateRange: $IndividualRateRange) {\n
            StateCode
            PlanId
            PlanType
            PlanMarketingName
            IndividualRate
            CoveredDiseasesCount
            SBCHavingaBabyDeductible
            SBCHavingaBabyCopayment
            SBCHavingaBabyCoinsurance
            SBCHavingaBabyLimit
            SBCHavingDiabetesDeductible
            SBCHavingDiabetesCopayment
            SBCHavingDiabetesCoinsurance
            SBCHavingDiabetesLimit
            SBCHavingSimplefractureDeductible
            SBCHavingSimplefractureCopayment
            SBCHavingSimplefractureCoinsurance
          }
        }`,
    variables: {
      StateCode: params.state.code,
      Age: params.age,
      PlanType: params.planType,
      CoveredDiseases: params.coveredDiseasesPrograms,
      IndividualRateRange: params.price
    }
  });
  console.log(
    ">> available CheapestPlansByParams Rows",
    res.data.data.CheapestPlansByParams.length
  );
  return res.data.data.CheapestPlansByParams;
};

export const getAgeFilterOptions = async params => {
  try {
    const res = await axios.post(endpoints.insurancePlans, {
      crossDomain: true,
      query: `query getAgeFilterOptions ($StateCode: String, $PlanType: [String], $CoveredDiseases: [String], $IndividualRateRange: PriceRangeType) {
        AgeFilterOptions (StateCode: $StateCode, PlanType: $PlanType, CoveredDiseases: $CoveredDiseases, IndividualRateRange: $IndividualRateRange) {
            Age
        }\n}`,
      variables: {
        StateCode: params.state.code,
        PlanType: params.planType,
        CoveredDiseases: params.coveredDiseasesPrograms,
        IndividualRateRange: params.price
      }
    });
    return res.data.data.AgeFilterOptions;
  } catch (e) {
    console.log("err", e);
    return [];
  }
};

export const getStateFilterOptions = async params => {
  try {
    console.log(">params", params);
    const res = await axios.post(endpoints.insurancePlans, {
      crossDomain: true,
      query: `query getStateFilterOptions ($Age: String, $PlanType: [String], $CoveredDiseases: [String], $IndividualRateRange: PriceRangeType) {
        StateFilterOptions (Age: $Age, PlanType: $PlanType, CoveredDiseases: $CoveredDiseases, IndividualRateRange: $IndividualRateRange) {
            StateCode
        }\n}`,
      variables: {
        Age: params.age,
        PlanType: params.planType,
        CoveredDiseases: params.coveredDiseasesPrograms,
        IndividualRateRange: params.price
      }
    });
    return res.data.data.StateFilterOptions;
  } catch (e) {
    console.log("err", e);
    return [];
  }
};

export const getPlanTypeFilterOptions = async params => {
  try {
    const res = await axios.post(endpoints.insurancePlans, {
      crossDomain: true,
      query: `query getPlanTypeFilterOptions ($StateCode: String, $Age: String, $CoveredDiseases: [String], $IndividualRateRange: PriceRangeType) {
        PlanTypeFilterOptions (StateCode: $StateCode, Age: $Age, CoveredDiseases: $CoveredDiseases, IndividualRateRange: $IndividualRateRange) {
            PlanType}\n}`,
      variables: {
        StateCode: params.state.code,
        Age: params.age,
        CoveredDiseases: params.coveredDiseasesPrograms,
        IndividualRateRange: params.price
      }
    });
    return res.data.data.PlanTypeFilterOptions;
  } catch (e) {
    console.log("err", e);
    return [];
  }
};

export const getCoveredDiseasesFilterOptions = async params => {
  try {
    console.log("> params", params);
    const res = await axios.post(endpoints.insurancePlans, {
      crossDomain: true,
      query: `query getCoveredDiseasesFilterOptions ($StateCode: String, $Age: String, $PlanType: [String], $IndividualRateRange: PriceRangeType) {
        CoveredDiseasesFilterOptions (StateCode: $StateCode, Age: $Age, PlanType: $PlanType,  IndividualRateRange: $IndividualRateRange) {
            DiseaseManagementProgramsOffered
            }
          }`,
      variables: {
        StateCode: params.state.code,
        Age: params.age,
        PlanType: params.planType,
        IndividualRateRange: params.price
      }
    });
    return res.data.data.CoveredDiseasesFilterOptions;
  } catch (e) {
    console.log("err", e);
    return [];
  }
};

// export const extractDistinctFiltersList = async (state, filterType) => {
//   this.$store.commit("filterIsLoading", true);

//   let result = await getAvailableFilterLists();
//   let distinctStateCode = [
//     ...new Set(this._.map(result, row => row.StateCode))
//   ];
//   let distinctPlanType = [
//     ...new Set(this._.map(result, row => row.PlanType))
//   ];
//   let distinctAge = [...new Set(this._.map(result, row => row.Age))];
//   // let distinctMetalLevel = {
//   //   Bronze: this._.find(result, ["MetalLevel", "Bronze"]),
//   //   ExpandedBronze: this._.find(result, ["MetalLevel", "Expanded Bronze"])
//   // };
//   let distinctCoveredDiseasePrograms = {
//     Asthma: this._.find(result, ["CoveredAsthma", "True"]),
//     Depression: this._.find(result, ["CoveredDepression", "True"]),
//     Diabetes: this._.find(result, [("CoveredDiabetes", "True")]),
//     HeartDisease: this._.find(result, [("CoveredHeartDisease", "True")]),
//     HighBloodPressureCholesterol: this._.find(
//       result[("CoveredHighBloodPressureCholesterol", "True")]
//     ),
//     LowBackPain: this._.find(result, [("CoveredLowBackPain", "True")]),
//     PainManagement: this._.find(result[("CoveredPainManagement", "True")]),
//     Pregnancy: this._.find(result, [("CoveredPregnancy", "True")]),
//     WeightLossPrograms: this._.find(
//       result[("CoveredWeightLossPrograms", "True")]
//     )
//   };

//   if (filterType != "PlanType") {
//     let updatedPlanOptions = filterOptions.map(plan => {
//       let hasValue = new Set(distinctPlanType).has(plan.text || plan);
//       return {
//         text: plan.text || plan,
//         value: hasValue ? plan.text || plan : null,
//         disabled: !hasValue
//       };
//     });

//     console.log(">>> updatedPlanOptions", updatedPlanOptions);
//     filterOptions = updatedPlanOptions;
//     // this.selectedPlanType = this._.filter(this.selectedPlanType, plan => {
//     //   !disabledSet.has(plan);
//     // });
//   }
//   if (filterType != "Age") {
//     let ageSet = new Set(distinctAge);
//     this.availableAgeOptions = [{ value: null, text: "All" }].concat(
//       this._.range(18, 31).map(function (age) {
//         return { text: age, disabled: !ageSet.has(age) };
//       })
//     );
//   }

//   if (filterType != "CoveredDiseases") {
//     defaultCoveredDiseasesPrograms.map(function (program) {
//       return distinctCoveredDiseasePrograms[program]
//         ? program
//         : { text: program, disabled: true };
//     });
//   }

//   // if (filterType != "MetalLevel") {
//   //   this.metalLevelOptions = distinctMetalLevel;
//   // }

//   if (filterType != "StateCode") {
//     // TODO: Bugs
//     let resultWithOnlyPreselectedState =
//       distinctStateCode.length == 1 &&
//       distinctStateCode[0] == this.selectedState;

//     console.log(
//       ">> resultWithOnlyPreselectedState",
//       resultWithOnlyPreselectedState
//     );

//     if (!resultWithOnlyPreselectedState) {
//       this.availableStateList = distinctStateCode;
//     }
//   } else {
//     // Triggered by state filter
//     if (!this.selectedState) {
//       this.availableStateList = distinctStateCode;
//     }
//   }
//   this.$store.commit("filterIsLoading", false);
//   return;
// };
