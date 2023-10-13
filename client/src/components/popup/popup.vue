<template>
  <div style="margin-top: 60px"/>
  <v-alert
      v-if="error"
      type="error"
      title="Erreur"
      :text="error"
      density="compact"
      style="width: 80vw; margin-left: 10vw"
      closable
      @click:close="clearError"
  />
  <v-alert
      v-if="success"
      type="success"
      :text="success"
      density="compact"
      style="width: 80vw; margin-left: 10vw"
      closable
      @click:close="clearSuccess"
  />
  <v-alert
      v-if="warning"
      type="warning"
      title="Attention"
      :text="warning"
      density="compact"
      style="width: 80vw; margin-left: 10vw"
      closable
      @click:close="clearWarning"
  />
  <v-alert
      v-if="info"
      type="info"
      title="Information"
      :text="info"
      density="compact"
      style="width: 80vw; margin-left: 10vw"
      closable
      @click:close="clearInfo"
  />
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState("popupModule", ["error","success","info","warning"]),
  },
  methods: {
    ...mapMutations("popupModule", ["clearError","clearSuccess","clearInfo","clearWarning"])
  }
};
</script>
