<template>
  <div id="plan-based-view">
    <div class="plan-info-section">
      <div class="plan-title">
        <img alt="plan-based View Icon" src="../assets/plan.png" />
        <div>PLAN-BASED</div>
      </div>

      <div class="plan-info">
        <b-icon icon="info" font-scale="1"></b-icon>
        <div>Hover/click to see more information.</div>
      </div>
    </div>

    <ListPlanCard title="Cheapest Plans" />
    <div id="plan-details">
      <div class="rankedAttributes">
        <AttributeCard
          v-bind:title="`Selected Attributes`"
          showAttributeName="true"
          v-bind:selectedAttributeName="selectedAttribute"
          v-bind:selectedAttribute="matchHash[selectedAttribute]"
        />
        <div v-for="(plan, index) in selectedAttributeLists" :key="plan.PlanId">
          <AttributeCard
            v-bind:index="index"
            v-bind:plan="plan"
            v-bind:selectedAttribute="matchHash[selectedAttribute]"
            v-bind:placeholderCard="!!plan.placeholder"
          />
        </div>
      </div>

      <div id="planBasedComparison"></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ListPlanCard from "./ListPlanCard.vue";
import AttributeCard from "./AttributeCard.vue";
import Highcharts from "highcharts";

require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/data")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

export default {
  name: "PlanBased",
  props: [],
  components: {
    ListPlanCard,
    AttributeCard
  },
  data() {
    return {
      spiderChart: null,
      selectedAttribute: null,
      selectedAttributeLists: [
        { PlanId: "temp1", placeholder: true },
        { PlanId: "temp2", placeholder: true },
        { PlanId: "temp3", placeholder: true }
      ],
      matchHash: {
        "Monthly Premium Rate": "IndividualRate",
        "# of Covered Diseases": "CoveredDiseasesCount",
        "Pregnancy Deductible": "SBCHavingaBabyDeductible",
        "Pregnancy Copayment": "SBCHavingaBabyCopayment",
        "Pregnancy Coinsurance": "SBCHavingaBabyCoinsurance",
        "Pregnancy Limit": "SBCHavingaBabyLimit",
        "Diabetes Deductible": "SBCHavingDiabetesDeductible",
        "Diabetes Copayment": "SBCHavingDiabetesCopayment",
        "Diabetes Coinsurance": "SBCHavingDiabetesCoinsurance",
        "Diabetes Limit": "SBCHavingDiabetesLimit",
        "Simple fracture Deductible": "SBCHavingSimplefractureDeductible",
        "Simple fracture Copayment": "SBCHavingSimplefractureCopayment",
        "Simple fracture Coinsurance": "SBCHavingSimplefractureCoinsurance"
      }
    };
  },
  computed: mapState(["cheapestPlans"]),
  methods: {
    getSpiderChartOptions(cheapestPlans) {
      if (!cheapestPlans || cheapestPlans.length == 0) {
        cheapestPlans = [
          { PlanMarketingName: "No Available Plan" },
          { PlanMarketingName: "No Available Plan" },
          { PlanMarketingName: "No Available Plan" }
        ];
      }
      let seriesData = [];
      let attributesHash = this._.reduce(
        cheapestPlans,
        (result, plan) => {
          result["IndividualRate"].push(plan.IndividualRate);
          result["CoveredDiseasesCount"].push(plan.CoveredDiseasesCount);
          result["SBCHavingaBabyDeductible"].push(
            plan.SBCHavingaBabyDeductible
          );
          result["SBCHavingaBabyCopayment"].push(plan.SBCHavingaBabyCopayment);
          result["SBCHavingaBabyCoinsurance"].push(
            plan.SBCHavingaBabyCoinsurance
          );
          result["SBCHavingaBabyLimit"].push(plan.SBCHavingaBabyLimit);
          result["SBCHavingDiabetesDeductible"].push(
            plan.SBCHavingDiabetesDeductible
          );
          result["SBCHavingDiabetesCopayment"].push(
            plan.SBCHavingDiabetesCopayment
          );
          result["SBCHavingDiabetesCoinsurance"].push(
            plan.SBCHavingDiabetesCoinsurance
          );
          result["SBCHavingDiabetesLimit"].push(plan.SBCHavingDiabetesLimit);
          result["SBCHavingSimplefractureDeductible"].push(
            plan.SBCHavingSimplefractureDeductible
          );
          result["SBCHavingSimplefractureCopayment"].push(
            plan.SBCHavingSimplefractureCopayment
          );
          result["SBCHavingSimplefractureCoinsurance"].push(
            plan.SBCHavingSimplefractureCoinsurance
          );
          return result;
        },
        {
          IndividualRate: [],
          CoveredDiseasesCount: [],
          SBCHavingaBabyDeductible: [],
          SBCHavingaBabyCopayment: [],
          SBCHavingaBabyCoinsurance: [],
          SBCHavingaBabyLimit: [],
          SBCHavingDiabetesDeductible: [],
          SBCHavingDiabetesCopayment: [],
          SBCHavingDiabetesCoinsurance: [],
          SBCHavingDiabetesLimit: [],
          SBCHavingSimplefractureDeductible: [],
          SBCHavingSimplefractureCopayment: [],
          SBCHavingSimplefractureCoinsurance: []
        }
      );

      let indexOf = this._.indexOf;

      let clickFunctionWrapper = (function(that) {
        return function(event) {
          that.selectedAttribute = event.point.category;
        };
      })(this);

      let colors = ["#EB8537", "#72CFCF", "#4B2472"];

      seriesData = cheapestPlans.map(function(plan, index) {
        return {
          name: plan.PlanMarketingName,
          events: {
            click: clickFunctionWrapper
          },
          color: colors[index],
          data: [
            indexOf(attributesHash["IndividualRate"], plan.IndividualRate) + 1,
            indexOf(
              attributesHash["CoveredDiseasesCount"],
              plan.CoveredDiseasesCount
            ) + 1,
            indexOf(
              attributesHash["SBCHavingaBabyDeductible"],
              plan.SBCHavingaBabyDeductible
            ) + 1,
            indexOf(
              attributesHash["SBCHavingaBabyCopayment"],
              plan.SBCHavingaBabyCopayment
            ) + 1,
            indexOf(
              attributesHash["SBCHavingaBabyCoinsurance"],
              plan.SBCHavingaBabyCoinsurance
            ) + 1,
            indexOf(
              attributesHash["SBCHavingaBabyLimit"],
              plan.SBCHavingaBabyLimit
            ) + 1,
            indexOf(
              attributesHash["SBCHavingDiabetesDeductible"],
              plan.SBCHavingDiabetesDeductible
            ) + 1,
            indexOf(
              attributesHash["SBCHavingDiabetesCopayment"],
              plan.SBCHavingDiabetesCopayment
            ) + 1,
            indexOf(
              attributesHash["SBCHavingDiabetesCoinsurance"],
              plan.SBCHavingDiabetesCoinsurance
            ) + 1,
            indexOf(
              attributesHash["SBCHavingDiabetesLimit"],
              plan.SBCHavingDiabetesLimit
            ) + 1,
            indexOf(
              attributesHash["SBCHavingSimplefractureDeductible"],
              plan.SBCHavingSimplefractureDeductible
            ) + 1,
            indexOf(
              attributesHash["SBCHavingSimplefractureCopayment"],
              plan.SBCHavingSimplefractureCopayment
            ) + 1,
            indexOf(
              attributesHash["SBCHavingSimplefractureCoinsurance"],
              plan.SBCHavingSimplefractureCoinsurance
            ) + 1
          ],
          pointPlacement: "on"
        };
      });

      seriesData = this._.reverse(seriesData);

      let spirderGraphOption = {
        chart: {
          polar: true,
          type: "line",
          width: 800,
          height: 600
        },
        plotOptions: {
          series: {
            cursor: "pointer"
          }
        },
        subtitle: {
          text: "Click on legend to filter plan."
        },
        title: {
          text: "Comparison Ranking among 3 Chpeapest Insurance Plans"
        },
        pane: {
          size: "70%"
        },
        xAxis: {
          categories: [
            "Monthly Premium Rate",
            "# of Covered Diseases",
            "Pregnancy Deductible",
            "Pregnancy Copayment",
            "Pregnancy Coinsurance",
            "Pregnancy Limit",
            "Diabetes Deductible",
            "Diabetes Copayment",
            "Diabetes Coinsurance",
            "Diabetes Limit",
            "Simple fracture Deductible",
            "Simple fracture Copayment",
            "Simple fracture Coinsurance"
          ],
          tickmarkPlacement: "on",
          lineWidth: 0
        },
        yAxis: {
          gridLineInterpolation: "polygon",
          className: "spider-chart-y-axis",
          reversed: true,
          tickPositions: [0, 1, 2, 3, 4],
          lineWidth: 0,
          labels: {
            format: "Rank {value}"
          }
        },
        tooltip: {
          shared: true,
          // positioner: function() {
          //   return { x: 450, y: 450 };
          // },
          pointFormat:
            '<span style="color:{series.color}">{series.name}: <br/><b>Relative Ranking: {point.y:,.0f}</b><br/>'
        },
        legend: {
          align: "center",
          verticalAlign: "bottom",
          layout: "vertical",
          reversed: true
        },
        series: seriesData,
        responsive: {
          rules: []
        }
      };

      return spirderGraphOption;
    }
  },
  mounted() {
    this.$store.watch(
      state => state.cheapestPlans,
      newVal => {
        this.$store.commit("spiderChartIsLoading", true);
        if (this.spiderChart) {
          this.spiderChart.update(this.getSpiderChartOptions(newVal), {
            oneToOne: true
          });
        } else {
          this.spiderChart = Highcharts.chart(
            "planBasedComparison",
            this.getSpiderChartOptions(newVal)
          );
        }

        if (this.selectedAttribute) {
          this.selectedAttributeLists = this._.sortBy(
            newVal,
            this.matchHash[this.selectedAttribute]
          );
        }

        this.$store.commit("spiderChartIsLoading", false);
      }
    );
  },
  watch: {
    selectedAttribute(newVal) {
      this.selectedAttributeLists = this._.sortBy(
        this.cheapestPlans,
        this.matchHash[newVal]
      );
    }
  }
};
</script>

<style scoped>
#plan-based-view {
  width: 100vw;
  margin-top: 120px;
}

.plan-info-section {
  display: inline-flex;
  align-items: center;
  width: 100vw;
}

.plan-title {
  display: inline-flex;
  margin-left: 75px;
}

.plan-title img {
  width: 37px;
  height: 37px;
  display: inline-table;
  margin: auto;
}

.plan-title div {
  color: var(--optional-blue);
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
  display: inline-table;
}

.plan-info {
  color: var(--hover-grey);
  font-size: 14px;
  margin-left: 24px;
}

.plan-info {
  display: inline-flex;
}

.plan-info .b-icon.bi {
  margin: auto;
}

#plan-details {
  display: flex;
  margin-top: 20px;
}

#planBasedComparison {
  width: 800px;
  margin: auto;
  display: inline-block;
}

.rankedAttributes {
  display: inline-block;
  margin-left: 74px;
}
</style>