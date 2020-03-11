<template>
  <div id="filter-section">
    <div id="filter-header">
      <h1 class="site-tag">VizHealth</h1>
      <p
        class="site-short-desc"
      >An interactive dashboard to understand and explore health insurance in the United States</p>
    </div>

    <div class="filter-info-section">
      <div class="filter-title">
        <img alt="Filter Icon" src="../assets/filter.png" />
        <div>FILTER</div>
      </div>

      <div class="filter-info">
        <b-icon icon="info" font-scale="1"></b-icon>
        <div>Input your demographic information & prefered plans and coverage to see a more cutomized insurance plan.</div>
      </div>

      <b-button
        v-on:click="resetFilters"
        variant="outline-secondary"
        class="reset-button"
        size="sm"
      >Reset All</b-button>
    </div>
    <b-form>
      <div class="exposed-filters">
        <b-form inline class="filter-row">
          <b-input-group prepend="Age" size="sm">
            <b-form-select
              id="age-input"
              prepend="Age"
              :options="ageOptions"
              size="sm"
              v-model="selectedAge"
            ></b-form-select>
          </b-input-group>

          <b-form-select v-model="selectedState" :options="stateOptions" size="sm"></b-form-select>

          <b-input-group>
            <b-form-input
              id="min-price"
              v-model="selectedMinPrice"
              :state="minPriceState"
              type="number"
              placeholder="Min Price: 0"
              debounce="1000"
              size="sm"
            ></b-form-input>
            <!-- This will only be shown if the preceding input has an invalid state -->
            <b-form-invalid-feedback id="input-live-feedback">Please enter price more than 0</b-form-invalid-feedback>
          </b-input-group>

          <b-input-group>
            <b-form-input
              id="max-price"
              v-model="selectedMaxPrice"
              :state="maxPriceState"
              type="number"
              placeholder="Max Price: 800"
              debounce="1000"
              size="sm"
            ></b-form-input>
            <b-form-invalid-feedback id="input-live-feedback">Please enter price less than 800</b-form-invalid-feedback>
          </b-input-group>

          <div class="filter-labels">Plan Type</div>
          <b-form-checkbox-group
            v-model="selectedPlanType"
            :options="planTypeOptions"
            switches
            size="sm"
          ></b-form-checkbox-group>
        </b-form>

        <b-form inline class="coveredDiseases">
          <div class="tag-options">
            <b-form-group label>
              <b-form-tags
                v-model="selectedCoveredDiseasesPrograms"
                size="lg"
                add-on-change
                no-outer-focus
              >
                <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                  <b-form-select
                    v-bind="inputAttrs"
                    v-on="inputHandlers"
                    :disabled="disabled || coveredDiseaseOptions.length === 0"
                    :options="coveredDiseaseOptions"
                    size="sm"
                  >
                    <template v-slot:first>
                      <option disabled value>Covered Disease Programs</option>
                    </template>
                  </b-form-select>
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
                </template>
              </b-form-tags>
            </b-form-group>
          </div>
        </b-form>
      </div>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "GeneralFilters",
  computed: {
    minPriceState() {
      if (this.selectedMinPrice) {
        return this.selectedMinPrice >= 0;
      } else {
        return null;
      }
    },
    maxPriceState() {
      if (this.selectedMaxPrice) {
        return this.selectedMaxPrice < 800;
      } else {
        return null;
      }
    },
    selectedAge: {
      get() {
        return this.$store.state.selectedFilters.age;
      },
      set(newVal) {
        this.$store.dispatch("updateContentBySelectedFilter", {
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
        this.$store.dispatch("updateContentBySelectedFilter", {
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
        if (
          JSON.stringify(newVal) !=
          JSON.stringify(this.$store.state.selectedFilters.planType)
        ) {
          this.$store.dispatch("updateContentBySelectedFilter", {
            newVal,
            filterType: "planType"
          });
        }
      }
    },
    selectedState: {
      get() {
        return this.$store.state.selectedFilters.state.code;
      },
      set(newVal) {
        this.$store.dispatch("updateContentBySelectedFilter", {
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
        if (newVal == this.selectedMinPrice) {
          return;
        } else {
          this.$store.dispatch("updateContentBySelectedFilter", {
            newVal,
            filterType: "price",
            type: "min"
          });
        }
      }
    },
    selectedMaxPrice: {
      get() {
        return this.$store.state.selectedFilters.price.max;
      },
      set(newVal) {
        if (newVal == this.selectedMaxPrice) {
          return;
        }

        this.$store.dispatch("updateContentBySelectedFilter", {
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
    resetFilters() {
      this.$store.dispatch("resetFilters");
    },
    onCoveredDiseaseOptionClick({ option, addTag }) {
      addTag(option);
      this.coveredDiseaseSearch = "";
    }
  }
};
</script>

<style scoped>
#filter-section {
  position: fixed;
  min-width: 1000px;
  background-color: var(--primary-grey);
  padding-bottom: 15px;
  box-shadow: 0px 4px 20px rgba(14, 30, 94, 0.1);
}

#filter-header {
  background-color: var(--optional-blue);
  width: 100vw;
  height: 44px;
  color: white;
  display: flex;
  align-items: center;
}

.site-tag {
  margin: auto 0 6px 75px;
  font-weight: bold;
  font-size: 26px;
}

.site-short-desc {
  margin: auto 0 8px 15px;
  font-size: 14px;
}

.filter-info-section {
  display: inline-table;
}

.filter-title {
  display: inline-flex;
  margin: 25px 0 auto 75px;
}

.filter-title img {
  width: 15px;
  height: 15px;
  display: inline-table;
  margin: auto;
}

.filter-title div {
  color: var(--optional-blue);
  font-size: 18px;
  font-weight: bold;
  margin-left: 5px;
  display: inline-table;
}

.filter-info {
  color: var(--hover-grey);
  font-size: 14px;
  margin: auto 0 auto 24px;
}

.filter-info {
  display: inline-flex;
}

.filter-info .b-icon.bi {
  margin: auto;
}

.reset-button {
  position: fixed;
  right: 65px;
  top: 99px;
}

.filter-row {
  width: 1000px;
  display: flex;
  justify-content: space-evenly;
  margin: 10px 0 auto 63px;
}

.filter-labels {
  width: 70px;
}

.coveredDiseases {
  margin: 12px 0 auto 87px;
}

.exposed-filters {
  width: 100vw;
  /* height: 150px; */
  display: flex;
  flex-flow: column;
  z-index: 10;
}

.exposed-filters .form-control {
  border: none;
  border-radius: none;
  background-color: transparent;
  padding: 0;
  text-align: center;
}

.exposed-filters .coveredDiseases {
  min-width: 1200px;
}

.exposed-filters .coveredDiseases .form-control .custom-select {
  margin-right: 10px;
  width: 230px;
  vertical-align: top;
  margin-top: 3px;
  float: left;
}

.exposed-filters .list-inline {
  float: left;
}

.exposed-filters .list-inline .list-inline-item {
  margin: 3px;
}

#min-price,
#max-price {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  background-color: white;
}
</style>