<template>
  <div class="listed-plan-card">
    <div v-if="showErrorMessage">Sorry we've encountered some errors.</div>
    <div class="title">{{title}}</div>

    <div class="cards-wrapper">
      <div class="cards" v-for="(plan, index) in plans" :key="plan.PlanId">
        <div class="content">
          #{{index + 1}}. {{plan.PlanMarketingName}}
          <div class="description">${{plan.IndividualRate}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListPlanCard",
  components: {},
  props: ["title"],
  data() {
    return {
      showErrorMessage: false
    };
  },
  computed: {
    plans() {
      return this.$store.state.cheapestPlans;
    },
    toolTipTexts: function() {
      return this._.reduce(
        this.plans,
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
  mounted() {
    this.$store.dispatch("updateCheapestPlan");
  }
};
</script>

<style scoped>
.listed-plan-card {
  display: flex;
  flex-flow: column;
  margin: auto;
  align-items: center;
  margin-top: 30px;
  width: 90vw;
  min-width: 1000px;
  background-color: #fff;
  padding-bottom: 20px;
}

.cards-wrapper {
  justify-content: space-evenly;
  display: flex;
  align-items: baseline;
}

.cards {
  display: inline-flex;
  flex-direction: column;
  width: 30%;
  min-width: 300px;
  text-align: center;
  margin-top: 24px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin: 18px 0 24px 0;
}

.content {
  margin: auto;
  font-size: 18px;
}

.description {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
}

.placeholder {
  height: 112px;
}
</style>