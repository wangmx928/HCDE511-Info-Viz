<template>
  <div class="listed-plan-card">
    <div v-if="showErrorMessage">Sorry we've encountered some errors.</div>

    <div class="content">
      <div class="title">{{title}}</div>

      <div class="description" v-for="(plan, index) in plans" :key="plan.PlanId">
        <p v-b-tooltip.hover.left.v-info :title="toolTipTexts[plan.PlanId]">
          <b-icon icon="info" font-scale="1"></b-icon>
          {{index + 1}}. {{plan.PlanMarketingName}} - ${{plan.IndividualRate}}
        </p>
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