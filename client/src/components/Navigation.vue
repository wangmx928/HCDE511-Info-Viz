<template>
  <div id="nav-bar">
    <b-nav vertical v-b-scrollspy="200">
      <b-nav-item active href="#state-based-view">State-based View</b-nav-item>
      <b-nav-item href="#plan-based-view">Plan-based View</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  props: {}
};
</script>

<style scoped>
#nav-bar {
  position: fixed;
  top: 35vh;
  right: 10px;
  font-weight: bold;
  z-index: 10;
}

.nav-item {
  margin: 10px;
  background-color: rgba(255, 255, 255, 1);
  /* box-shadow: 0 0.46875rem 2.1875rem rgba(170, 207, 250, 0.2); */
  box-shadow: 0 0.46875rem 2.1875rem rgba(90, 97, 105, 0.1),
    0 0.9375rem 1.40625rem rgba(90, 97, 105, 0.1),
    0 0.25rem 0.53125rem rgba(90, 97, 105, 0.12),
    0 0.125rem 0.1875rem rgba(90, 97, 105, 0.1);
  /* border-radius: 2rem; */
}

.nav-pills .nav-link {
  border-radius: 5rem;
  color: var(--theme-blue);
}

.nav-pills .nav-link.active {
  background-color: var(--theme-blue);
  color: white;
}
</style>