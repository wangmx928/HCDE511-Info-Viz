import axios from "axios";
import { endpoints } from "./constants";

export const getAllHealthInsuranceQuality = async () => {
  try {
    const res = await axios.post(endpoints.insuranceQuality, {
      crossDomain: true,
      query: `{
                InsuranceQuality {
                  State
                  Code
                  USNewsRank
                  WalletHubCompositeScore
                }
              }`
    });
    return res.data.data.InsuranceQuality;
  } catch (e) {
    console.log("err", e);
  }
};

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
      CoveredDiseases: params.coveredDiseasesPrograms,
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