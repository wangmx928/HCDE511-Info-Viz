
    <!-- <b-button class="mb-2 toggle-filter" @click="isVisible = !isVisible" v-show="!isVisible">
      <b-icon icon="filter" style="color:white;" class="icon-class"></b-icon>Show Filters
    </b-button>
    <b-button class="mb-2 toggle-filter" @click="isVisible = !isVisible" v-show="isVisible">
      <b-icon icon="filter" style="color:white;" class="icon-class"></b-icon>Hide Filters
    </b-button>-->

    <!-- Vertical section -->
    <!-- <div class="expanded-sections" v-show="isVisible"> -->
    <!-- <div class="filterHeader">Demographics</div>
    <div class="text">Input your demographic information to see a more cutomized insurance plan.</div>-->

    <!-- Age -->
    <!-- <div class="sub-filter"> -->
    <!-- <b-form-select v-model="selectedAge" :options="ageOptions"></b-form-select> -->
    <!-- <div class="mt-3">
          <div class="debug-text">Age Selected (debug): {{ selectedAge }}</div>
    </div>-->
    <!-- </div> -->

    <!-- State -->
    <!-- <div class="sub-filter">
        <b-form-select v-model="selectedState" :options="stateOptions"></b-form-select>
    </div>-->

    <!-- <div class="filterHeader">Coverage</!-->
    <!-- <div
        class="text"
    >Filter prefered plans and coverage. Hover on the term to see the description.</div>-->

    <!-- PlanType -->
    <!-- <div class="sub-filter"> -->
    <!-- <b-form-select v-model="selectedPlanType" :options="planTypeOptions"></b-form-select> -->
    <!-- <div class="mt-3">
          <div class="debug-text">PlanType Selected (debug): {{ selectedPlanType }}</div>
    </div>-->
    <!-- </div> -->

    <!-- CoveredDisease -->
    <!-- <div class="sub-filter">
        <b-form-tags v-model="coveredDiseaseSelectedValues" no-outer-focus class="mb-2">
          <template v-slot="{ tags, disabled, addTag, removeTag }">
            <ul v-if="tags.length > 0" class="list-inline d-inline-block mb-2">
              <li v-for="tag in tags" :key="tag" class="list-inline-item">
                <b-form-tag
                  @remove="removeTag(tag)"
                  :title="tag"
                  :disabled="disabled"
                  variant="info"
                >{{ tag }}</b-form-tag>
              </li>
            </ul>

            <b-dropdown size="sm" variant="outline-secondary" block menu-class="w-100">
              <template v-slot:button-content>
                <b-icon icon="tag-fill"></b-icon>Choose Covered Diseases
              </template>
              <b-dropdown-form @submit.stop.prevent="() => {}">
                <b-form-group
                  label-for="tag-search-input"
                  label="Search tags"
                  label-cols-md="auto"
                  class="mb-0"
                  label-size="sm"
                  :description="searchDesc"
                  :disabled="disabled"
                >
                  <b-form-input
                    v-model="coveredDiseaseSearch"
                    id="tag-search-input"
                    type="search"
                    size="sm"
                    autocomplete="off"
                  ></b-form-input>
                </b-form-group>
              </b-dropdown-form>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item-button
                v-for="option in availableCoveredOptions"
                :key="option"
                @click="onCoveredDiseaseOptionClick({ option, addTag })"
              >{{ option }}</b-dropdown-item-button>
              <b-dropdown-text
                v-if="availableCoveredOptions.length === 0"
              >There are no tags available to select</b-dropdown-text>
            </b-dropdown>
          </template>
        </b-form-tags>
    </div>-->

    <!-- Price -->
    <!-- <b-form id="priceFilters" class="sub-filter">
        <label for="price-range">Monthly Premium Rate</label>
        <b-form inline>
          <b-input-group prepend="Min $" size="sm">
            <b-form-input
              id="min-price"
              v-model="minPrice"
              type="number"
              placeholder="100"
              debounce="1000"
            ></b-form-input>
          </b-input-group>
          <b-input-group prepend="Max $" size="sm">
            <b-form-input
              id="max-price"
              v-model="maxPrice"
              type="number"
              placeholder="800"
              debounce="1000"
            ></b-form-input>
          </b-input-group>
        </b-form>
    </b-form>-->
    <!-- </div> -->


// import { statesWithHealthQualityData } from "../constants.js";
// export default {
//   name: "GeneralFilters",
//   components: {},
//   props: ["insuranceQualities", "availableStateList"],
//   data() {
//     return {
//       isVisible: true,
//       selectedAge: null,
//       ageOptions: [{ value: null, text: "All" }].concat(this._.range(18, 31)),
//       selectedState: null,
//       selectedPlanType: null,
//       planTypeOptions: [{ value: null, text: "All" }].concat([
//         "EPO",
//         "PPO",
//         "HMO",
//         "POS"
//       ]),
//       coveredDiseaseSearch: "",
//       coveredDiseaseSelectedValues: [],
//       coveredDiseaseOptions: [
//         "Pregnancy",
//         "Depression",
//         "Asthma",
//         "Low Back Pain",
//         "WeightLoss Programs",
//         "Heart Disease",
//         "Pain Management",
//         "HighBlood Pressure And Cholesterol",
//         "Diabetes"
//       ],
//       minPrice: null,
//       maxPrice: null
//     };
//   },
//   computed: {
//     filtersGroup() {
//       let min = isNaN(parseInt(this.minPrice)) ? null : parseInt(this.minPrice);
//       let max = isNaN(parseInt(this.maxPrice)) ? null : parseInt(this.maxPrice);
//       let age = this.selectedAge ? this._.toString(this.selectedAge) : null;
//       let filtersGroup = {
//         StateCode: this.selectedState,
//         Age: age,
//         PlanType: this.selectedPlanType,
//         CoveredDiseases: this.coveredDiseaseSelectedValues,
//         IndividualRateRange: { min, max }
//       };
//       this.$emit("update:filtersGroup", filtersGroup);
//       console.log("filtersGroup", filtersGroup);
//       return filtersGroup;
//     },
//     stateOptions() {
//       console.log(">> in stateoptions", this.availableStateList);
//       if (this.availableStateList && this.availableStateList.length > 1) {
//         let updatedSet = new Set(this.availableStateList);
//         let updated = statesWithHealthQualityData.map(function(state) {
//           return {
//             value: state,
//             text: state,
//             disabled: !updatedSet.has(state)
//           };
//         });
//         return [{ value: null, text: "State" }].concat(
//           this._.sortBy(updated, ["value"])
//         );
//       }
//       return [{ value: null, text: "State" }].concat(statesWithHealthQualityData);
//     },
//     criteria() {
//       // Compute the search criteria
//       return this.coveredDiseaseSearch.trim().toLowerCase();
//     },
//     availableCoveredOptions() {
//       const criteria = this.criteria;
//       // Filter out already selected coveredDiseaseOptions
//       const coveredDiseaseOptions = this.coveredDiseaseOptions.filter(
//         option => this.coveredDiseaseSelectedValues.indexOf(option) === -1
//       );
//       if (criteria) {
//         // Show only coveredDiseaseOptions that match criteria
//         return coveredDiseaseOptions.filter(
//           option => option.toLowerCase().indexOf(criteria) > -1
//         );
//       }
//       // Show all coveredDiseaseOptions available
//       return coveredDiseaseOptions;
//     },
//     searchDesc() {
//       if (this.criteria && this.availableCoveredOptions.length === 0) {
//         return "There are no tags matching your search criteria";
//       }
//       return "";
//     }
//   },
//   methods: {
//     onCoveredDiseaseOptionClick({ option, addTag }) {
//       addTag(option);
//       this.coveredDiseaseSearch = "";
//     },
//     handleVisibility(isVisible) {
//       this.isVisible = isVisible;
//     },
//     addToSelectedFilterValues(option) {
//       this.selectedFilterValues.push(option);
//     }
//   }
// };




/* #general-filters {
  display: flex;
  flex-flow: column;
  position: fixed;
  top: 10px;
  right: 20px;
  z-index: 10;
}

.toggle-filter {
}

.expanded-sections {
  padding: 0 20px;
  background-color: white;
  width: 350px;
  height: 80vh;
  overflow-y: scroll;
  box-shadow: 0 0.46875rem 2.1875rem rgba(90, 97, 105, 0.1),
    0 0.9375rem 1.40625rem rgba(90, 97, 105, 0.1),
    0 0.25rem 0.53125rem rgba(90, 97, 105, 0.12),
    0 0.125rem 0.1875rem rgba(90, 97, 105, 0.1);
}

.filterHeader {
  background-color: var(--light-grey);
  font-size: 16px;
  font-weight: bold;
  padding: 15px 0;
  /* margin-top: 35px; */
  text-align: center;
  border-left: 5px solid var(--theme-blue);
}

.icon-class {
  margin-right: 5px;
}

.text {
  color: var(--contrast-grey);
  font-size: 14px;
  margin: 15px;
}

.debug-text {
  font-size: 14px;
  color: var(--contrast-grey);
  margin: -5px 0;
}

#priceFilters .form-inline {
  display: flex;
  justify-content: space-evenly;
}

#priceFilters input {
  width: 100px;
}

.sub-filter {
  margin-bottom: 16px;
} */
