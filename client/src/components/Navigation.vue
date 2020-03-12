<template>
  <div id="nav-bar">
    <b-nav pills v-b-scrollspy="400">
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
  top: 0;
  right: 40px;
  font-weight: bold;
  z-index: 10;
}

.nav-item {
  margin-left: 10px;
}

.nav-pills .nav-link {
  border-radius: 5rem;
  color: #ffffff70;
  font-size: 18px;
}

.nav-pills .nav-link.active {
  background-color: var(--optional-blue);
  color: white;
}
</style>