<template>
  <div class="listed-plan-card">
    <b-button>isLoading: {{isLoading}}</b-button>

    <div v-if="showErrorMessage">Sorry we've encountered some errors.</div>

    <div class="content">
      <div class="title">{{title}}</div>

      <div class="description" v-for="(plan, index) in retrivedPlans" :key="plan.PlanId">
        <p v-b-tooltip.hover.left.v-info :title="toolTipTexts[plan.PlanId]">
          <b-icon icon="info" font-scale="1"></b-icon>
          {{index + 1}}. {{plan.PlanMarketingName}} - ${{plan.IndividualRate}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { endpoints } from "../constants.js";

export default {
  name: "ListPlanCard",
  components: {},
  props: ["filtersGroup", "title", "cardType", "plans"],
  data() {
    return {
      showErrorMessage: false,
      retrivedPlans: []
    };
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading.planBasedView.cheapestPlan;
    },
    toolTipTexts: function() {
      return this._.reduce(
        this.retrivedPlans,
        function(result, plan) {
          result[
            plan.PlanId
          ] = `The plan ${plan.PlanMarketingName} has average monthly rate as $${plan.IndividualRate}`;
          return result;
        },
        {}
      );
    }
  },
  methods: {
    async getCheapestPlans() {
      try {
        let res = {};
        console.log(">> getCheapestPlans: has filtersGroup", this.filtersGroup);
        res = await axios.post(endpoints.insurancePlans, {
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
            StateCode: this.filtersGroup.StateCode,
            Age: this.filtersGroup.Age,
            PlanType: this.filtersGroup.PlanType,
            CoveredDiseases: this.filtersGroup.CoveredDiseases,
            IndividualRateRange: this.filtersGroup.IndividualRateRange
          }
        });
        this.retrivedPlans = res.data.data.CheapestPlansByParams;
        // }
      } catch (e) {
        console.log("err", e);
        this.$store.commit("cheapestPlanIsLoading", false);
        this.showErrorMessage = true;
        this.retrivedPlans = [];
      }
    }
  },
  watch: {
    filtersGroup() {
      if (
        this.cardType == "isCheapestPlan" &&
        !this._.isEmpty(this.filtersGroup)
      ) {
        this.getCheapestPlans();
      }
    },
    retrivedPlans(newVal) {
      this.$emit("update:plans", newVal);
      console.log(">> Emit plans from ListPlanCard:", newVal);
      this.$store.commit("cheapestPlanIsLoading", false);
    }
  }
};
</script>

<style scoped>
.listed-plan-card {
  display: inline-flex;
  flex-direction: column;
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 20px 30px;
  border: none;
  border-radius: 0.625rem;
  box-shadow: 0 0.46875rem 2.1875rem rgba(90, 97, 105, 0.1),
    0 0.9375rem 1.40625rem rgba(90, 97, 105, 0.1),
    0 0.25rem 0.53125rem rgba(90, 97, 105, 0.12),
    0 0.125rem 0.1875rem rgba(90, 97, 105, 0.1);
}

.content {
  margin: auto;
}

.title {
  font-weight: bold;
  font-size: 22px;
}

.description {
  margin-top: 20px;
}

.placeholder {
  height: 112px;
}

.listed-plan-card p {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 20px;
}
</style>