<script>
export default {
  props: {
    items: Array
  },
  data() {
    return {
      selectedIndex: 0
    };
  },
  computed: {
    index() {
      return this.items.indexOf(this.items.find(item => item.href === this.$route.path));
    }
  },
  watch: {
    index(newValue) {
      this.selectedIndex = newValue;
    }
  }
};
</script>

<template>
  <v-container>
    <v-bottom-navigation
      v-if="items"
      v-model="selectedIndex"
      :bg-color="items[selectedIndex].color"
      mode="shift"
      fixed
      app
    >
      <v-btn
        v-for="item in items"
        :key="item.href"
        v-on:click="$router.push(item.href)"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ item.name }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<style scoped>

</style>
