<template>
  <div id="app" class="app">
    <page-loading
      :progress="loadingProgress"
      v-if="isLoading || isPreparingStops"
    >
      Загрузка путей и маршрутов
    </page-loading>
    <router-view v-else />
  </div>
</template>

<script>
import { mapActions, mapState } from "pinia";
import { useRoutesAndStopsStore } from "@/store/routes-and-stops";
import PageLoading from "./components/PageLoading.vue";

export default {
  components: { PageLoading },
  name: "App",
  computed: {
    ...mapState(useRoutesAndStopsStore, [
      "isLoading",
      "isPreparingStops",
      "loadingProgress",
    ]),
  },
  methods: {
    ...mapActions(useRoutesAndStopsStore, [
      // "usePreparedData",
      "fetchRoutesAndStops",
    ]),
  },
  async mounted() {
    // this.usePreparedData();
    this.fetchRoutesAndStops();
  },
};
</script>
