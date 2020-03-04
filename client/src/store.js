import _ from 'lodash';


export const appStore = {
  state: {
    isLoading: {
      filter: true,
      stateBasedView: true,
      planBasedView: { cheapestPlan: true, spiderChart: true },
    },
    needsRefresh: false
  },
  getters: {
    isPageLoading(state) {
      let subComponentsStatus = _.invertBy(state.isLoading.planBasedView);
      return (state.isLoading.filter || state.isLoading.stateBasedView ||
        ((true in subComponentsStatus) && subComponentsStatus[true].length));
    },
    currentLoadingComponent(state) {
      let currentLoadingComponent = [];
      if (state.isLoading.filter) {
        currentLoadingComponent.push('Filters');
      }
      if (state.isLoading.stateBasedView) {
        currentLoadingComponent.push('State Map');
      }
      let subComponentsStatus = _.invertBy(state.isLoading.planBasedView);
      if (true in subComponentsStatus && subComponentsStatus[true].length) {
        currentLoadingComponent = currentLoadingComponent.concat(subComponentsStatus[true])
      }
      return currentLoadingComponent;
    }
  },
  mutations: {
    filterIsLoading(state, isLoading) {
      state.isLoading.filter = isLoading;
      if (isLoading) {
        state.isLoading.stateBasedView = isLoading;
        state.isLoading.planBasedView.cheapestPlan = isLoading;
        state.isLoading.planBasedView.spiderChart = isLoading;
      }
    },
    stateBasedViewIsLoading(state, isLoading) {
      state.isLoading.stateBasedView = isLoading;
    },
    cheapestPlanIsLoading(state, isLoading) {
      state.isLoading.planBasedView.cheapestPlan = isLoading;
    },
    spiderChartIsLoading(state, isLoading) {
      state.isLoading.planBasedView.spiderChart = isLoading;
    }

  }
};