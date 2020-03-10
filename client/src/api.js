import axios from "axios";
import { endpoints } from "./constants";

export const getAvgMonthlyPremiumByParams = async (params) => {
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