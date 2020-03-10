<template>
  <b-form>
    <div class="debug-text">(debug): {{ filtersGroup }}</div>

    <div class="exposed-filters">
      <b-form inline>
        <div class="tag-options">
          <b-form-group label class="mb-1 mr-sm-1 mb-sm-0">
            <b-form-tags
              v-model="selectedCoveredDiseasesPrograms"
              size="lg"
              add-on-change
              no-outer-focus
              class="mb-1"
            >
              <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-1">
                  <li v-for="tag in tags" :key="tag" class="list-inline-item">
                    <b-form-tag
                      @remove="removeTag(tag)"
                      :title="tag"
                      :disabled="disabled"
                      variant="info"
                    >{{ tag }}</b-form-tag>
                  </li>
                </ul>
                <b-form-select
                  v-bind="inputAttrs"
                  v-on="inputHandlers"
                  :disabled="disabled || coveredDiseaseOptions.length === 0"
                  :options="coveredDiseaseOptions"
                >
                  <template v-slot:first>
                    <option disabled value>Covered Disease Programs</option>
                  </template>
                </b-form-select>
              </template>
            </b-form-tags>
          </b-form-group>
        </div>

        <b-input-group prepend="Age" class="mb-1 mr-sm-1 mb-sm-0">
          <b-form-select
            id="age-input"
            prepend="Age"
            class="mb-1 mr-sm-1 mb-sm-0"
            :options="ageOptions"
            v-model="selectedAge"
          ></b-form-select>
        </b-input-group>

        <b-form-group label="Plan Types">
          <b-form-checkbox-group
            name="planTypesContols"
            v-model="selectedPlanType"
            :options="planTypeOptions"
            switches
          ></b-form-checkbox-group>
        </b-form-group>
      </b-form>

      <b-form inline>
        <b-form-select v-model="selectedState" :options="stateOptions"></b-form-select>

        <b-input-group class="sm">
          <b-form-input
            id="min-price"
            v-model="selectedMinPrice"
            type="number"
            placeholder="Min Price：100"
            debounce="1000"
          ></b-form-input>
        </b-input-group>
        <b-input-group class="sm">
          <b-form-input
            id="max-price"
            v-model="selectedMaxPrice"
            type="number"
            placeholder="Max Price: 600"
            debounce="1000"
          ></b-form-input>
        </b-input-group>
      </b-form>
    </div>
  </b-form>
</template>

<script>
import axios from "axios";
import { endpoints, defaultCoveredDiseasesPrograms } from "../constants.js";

export default {
  name: "GeneralFilters",
  components: {},
  props: ["insuranceQualities"],
  data() {
    return {
      availableStateList: []
    };
  },
  computed: {
    filtersGroup() {
      return this.$store.state.selectedFilters;
    },
    selectedAge: {
      get() {
        return this.$store.state.selectedFilters.age;
      },
      set(newVal) {
        this.$store.dispatch("updateSelectedFilter", {
          newVal,
          filterType: "age"
        });
      }
    },
    selectedCoveredDiseasesPrograms: {
      get() {
        return this.$store.state.selectedFilters.coveredDiseasesPrograms;
      },
      set(newVal) {
        this.$store.dispatch("updateSelectedFilter", {
          newVal,
          filterType: "coveredDiseasesPrograms"
        });
      }
    },
    selectedPlanType: {
      get() {
        return this.$store.state.selectedFilters.planType;
      },
      set(newVal) {
        // TODO: infinite loop
        console.log("> selectedPlanType Changed");
        this.$store.dispatch("updateSelectedFilter", {
          newVal,
          filterType: "planType"
        });
      }
    },
    selectedState: {
      get() {
        return this.$store.state.selectedFilters.state.code;
      },
      set(newVal) {
        this.$store.dispatch("updateSelectedFilter", {
          newVal,
          filterType: "state",
          type: "code"
        });
      }
    },
    selectedMinPrice: {
      get() {
        return this.$store.state.selectedFilters.price.min;
      },
      set(newVal) {
        this.$store.dispatch("updateSelectedFilter", {
          newVal,
          filterType: "price",
          type: "min"
        });
      }
    },
    selectedMaxPrice: {
      get() {
        return this.$store.state.selectedFilters.price.max;
      },
      set(newVal) {
        this.$store.dispatch("updateSelectedFilter", {
          newVal,
          filterType: "price",
          type: "max"
        });
      }
    },
    ageOptions() {
      return this.$store.getters.ageOptions;
    },
    stateOptions() {
      return this.$store.getters.stateOptions;
    },
    coveredDiseaseOptions() {
      return this.$store.getters.coveredDiseasesProgramsOptions;
    },
    planTypeOptions() {
      return this.$store.getters.planTypeOptions;
    }
  },
  mounted() {
    this.$store.commit("filterIsLoading", false);
  },
  methods: {
    async getAvailableFilterLists() {
      try {
        const res = await axios.post(endpoints.insurancePlans, {
          crossDomain: true,
          query: `query getFiltersListOfPlan ($StateCode: String, $Age: String, $PlanType: [String], $CoveredDiseases: [String], $IndividualRateRange: PriceRangeType) {\n    FiltersListOfPlan (StateCode: $StateCode, Age: $Age, PlanType: $PlanType, CoveredDiseases: $CoveredDiseases, IndividualRateRange: $IndividualRateRange) {
            StateCode
            Age
            PlanType
            CoveredAsthma
            CoveredDepression
            CoveredDiabetes
            CoveredHeartDisease
            CoveredHighBloodPressureCholesterol
            CoveredLowBackPain
            CoveredPainManagement
            CoveredPregnancy
            CoveredWeightLossPrograms}\n}`,
          variables: {
            StateCode: this.filtersGroup.StateCode,
            Age: this.filtersGroup.Age,
            PlanType: this.filtersGroup.PlanType,
            CoveredDiseases: this.filtersGroup.CoveredDiseases,
            IndividualRateRange: this.filtersGroup.IndividualRateRange
          }
        });
        return res.data.data.FiltersListOfPlan;
      } catch (e) {
        console.log("err", e);
        return [];
      }
    },
    async extractDistinctFiltersList(sourceFilter) {
      this.$store.commit("filterIsLoading", true);

      let result = await this.getAvailableFilterLists();
      let distinctStateCode = [
        ...new Set(this._.map(result, row => row.StateCode))
      ];
      let distinctPlanType = [
        ...new Set(this._.map(result, row => row.PlanType))
      ];
      let distinctAge = [...new Set(this._.map(result, row => row.Age))];
      // let distinctMetalLevel = {
      //   Bronze: this._.find(result, ["MetalLevel", "Bronze"]),
      //   ExpandedBronze: this._.find(result, ["MetalLevel", "Expanded Bronze"])
      // };
      let distinctCoveredDiseasePrograms = {
        Asthma: this._.find(result, ["CoveredAsthma", "True"]),
        Depression: this._.find(result, ["CoveredDepression", "True"]),
        Diabetes: this._.find(result, [("CoveredDiabetes", "True")]),
        HeartDisease: this._.find(result, [("CoveredHeartDisease", "True")]),
        HighBloodPressureCholesterol: this._.find(
          result[("CoveredHighBloodPressureCholesterol", "True")]
        ),
        LowBackPain: this._.find(result, [("CoveredLowBackPain", "True")]),
        PainManagement: this._.find(result[("CoveredPainManagement", "True")]),
        Pregnancy: this._.find(result, [("CoveredPregnancy", "True")]),
        WeightLossPrograms: this._.find(
          result[("CoveredWeightLossPrograms", "True")]
        )
      };

      if (sourceFilter != "PlanType") {
        // let disabledSet = new Set();
        let updatedPlanOptions = this.planTypeOptions.map(plan => {
          let hasValue = new Set(distinctPlanType).has(plan.text || plan);
          return {
            text: plan.text || plan,
            value: hasValue ? plan.text || plan : null,
            disabled: !hasValue
          };
        });

        console.log(">>> updatedPlanOptions", updatedPlanOptions);
        this.planTypeOptions = updatedPlanOptions;
        // this.selectedPlanType = this._.filter(this.selectedPlanType, plan => {
        //   !disabledSet.has(plan);
        // });
      }
      if (sourceFilter != "Age") {
        let ageSet = new Set(distinctAge);
        this.availableAgeOptions = [{ value: null, text: "All" }].concat(
          this._.range(18, 31).map(function(age) {
            return { text: age, disabled: !ageSet.has(age) };
          })
        );
      }

      if (sourceFilter != "CoveredDiseases") {
        defaultCoveredDiseasesPrograms.map(function(program) {
          return distinctCoveredDiseasePrograms[program]
            ? program
            : { text: program, disabled: true };
        });
      }

      // if (sourceFilter != "MetalLevel") {
      //   this.metalLevelOptions = distinctMetalLevel;
      // }

      if (sourceFilter != "StateCode") {
        // TODO: Bugs
        let resultWithOnlyPreselectedState =
          distinctStateCode.length == 1 &&
          distinctStateCode[0] == this.selectedState;

        console.log(
          ">> resultWithOnlyPreselectedState",
          resultWithOnlyPreselectedState
        );

        if (!resultWithOnlyPreselectedState) {
          this.availableStateList = distinctStateCode;
        }
      } else {
        // Triggered by state filter
        if (!this.selectedState) {
          this.availableStateList = distinctStateCode;
        }
      }
      this.$store.commit("filterIsLoading", false);
      return;
    },
    onCoveredDiseaseOptionClick({ option, addTag }) {
      addTag(option);
      this.coveredDiseaseSearch = "";
    }
  }
};
</script>

<style scoped>
.exposed-filters {
  position: fixed;
  right: 15px;
  top: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 10;
}

.exposed-filters .list-inline .list-inline-item {
  margin: 3px;
  max-width: 90px;
}

.exposed-filters .form-control {
  border: none;
  border-radius: none;
  background-color: transparent;
  padding: 0;
  text-align: end;
  margin-top: 5px;
}

.exposed-filters .form-control .custom-select {
  margin-left: 5px;
  width: 160px;
}

.input-group-prepend {
  height: 38px;
}

#min-price,
#max-price {
  width: 120px;
  margin-left: 5px;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-color: white;
}
</style>