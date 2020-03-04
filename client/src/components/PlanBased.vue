<template>
  <div id="plan-based-view">
    <div deck class="list-plans">
      <!-- <ListPlanCard title="Best Coverage Plans" cardType="isBestCoverage" v-bind:filtersGroup="filtersGroup"/> -->
      <ListPlanCard
        title="Cheapest Plans"
        cardType="isCheapestPlan"
        v-bind:filtersGroup="filtersGroup"
        v-bind:plans.sync="plans"
      />
    </div>

    <div deck class="list-plans">
      <div>
        <div>{{selectedAttribute}}</div>
        <div class="description" v-for="(plan, index) in selectedAttributeLists" :key="plan.PlanId">
          <p>{{plan.PlanMarketingName}}</p>
          <p>Rank #{{index + 1}} - {{plan[matchHash[selectedAttribute]]}}</p>
        </div>
      </div>
      <figure class="highcharts-figure">
        <div id="planBasedComparison"></div>
        <p class="highcharts-description">
          A spiderweb chart or radar chart is a variant of the polar chart.
          Spiderweb charts are commonly used to compare multivariate data sets,
          like this demo using six variables of comparison.
        </p>
      </figure>
    </div>
  </div>
</template>

<script>
import ListPlanCard from "./ListPlanCard.vue";
import Highcharts from "highcharts";

require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/data")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

export default {
  name: "PlanBased",
  props: ["filtersGroup"],
  components: {
    ListPlanCard
  },
  data() {
    return {
      spiderChart: null,
      plans: [],
      selectedAttribute: null,
      selectedAttributeLists: [],
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
  methods: {
    getSpiderChartOptions() {
      let seriesData = null;
      if (this.plans && this.plans.length) {
        let attributesHash = this._.reduce(
          this.plans,
          (result, plan) => {
            result["IndividualRate"].push(plan.IndividualRate);
            result["CoveredDiseasesCount"].push(plan.CoveredDiseasesCount);
            result["SBCHavingaBabyDeductible"].push(
              plan.SBCHavingaBabyDeductible
            );
            result["SBCHavingaBabyCopayment"].push(
              plan.SBCHavingaBabyCopayment
            );
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
            //TODO: Work on the greying out effect
            console.log(
              ">> spider graph, clicked category:",
              event.point.category
            );
            that.selectedAttribute = event.point.category;
          };
        })(this);

        seriesData = this.plans.map(function(plan) {
          return {
            name: plan.PlanMarketingName,
            events: {
              click: clickFunctionWrapper
            },
            data: [
              indexOf(attributesHash["IndividualRate"], plan.IndividualRate) +
                1,
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
      }

      let spirderGraphOption = {
        chart: {
          polar: true,
          type: "line",
          height: 700,
          width: 800
        },
        title: {
          text: "Top 3 Chpeapest Insurance Plans Comparison - Ranking",
          x: -80
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
          reversed: true,
          lineWidth: 0,
          min: 0
        },
        tooltip: {
          shared: true,
          positioner: function() {
            return { x: 450, y: 450 };
          },
          pointFormat:
            '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
        },
        legend: {
          align: "right",
          verticalAlign: "middle",
          layout: "vertical"
        },
        series: seriesData
      };

      return spirderGraphOption;
    }
  },
  watch: {
    plans(newVal) {
      this.$store.commit("spiderChartIsLoading", true);
      if (this.spiderChart) {
        this.spiderChart.update(this.getSpiderChartOptions());
      } else {
        this.spiderChart = Highcharts.chart(
          "planBasedComparison",
          this.getSpiderChartOptions()
        );
      }

      if (this.selectedAttribute) {
        this.selectedAttributeLists = this._.sortBy(
          newVal,
          this.matchHash[this.selectedAttribute]
        );
      }

      this.$store.commit("spiderChartIsLoading", false);
    },
    selectedAttribute(newVal) {
      this.selectedAttributeLists = this._.sortBy(
        this.plans,
        this.matchHash[newVal]
      );
    }
  }
};
</script>

<style scoped>
#plan-based-view {
  width: 80vw;
  margin: 150px auto;
}

.list-plans {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 30px;
}

.highcharts-figure,
.highcharts-data-table table {
  min-width: 320px;
  max-width: 800px;
  margin: 1em auto;
}

.highcharts-data-table table {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
  max-width: 500px;
}
.highcharts-data-table caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}
.highcharts-data-table th {
  font-weight: 600;
  padding: 0.5em;
}
.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
  padding: 0.5em;
}
.highcharts-data-table thead tr,
.highcharts-data-table tr:nth-child(even) {
  background: #f8f8f8;
}
.highcharts-data-table tr:hover {
  background: #f1f7ff;
}

.highcharts-series-hover path {
  stroke: rgb(255, 66, 66);
  stroke-width: 2px;
}
</style>