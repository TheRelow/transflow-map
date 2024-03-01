<template>
  <DefaultLayout>
    <template #sidebar>
      <div class="switcher">
        <div>Маршруты</div>
        <div>Остановки</div>
      </div>
      <RoutesAndStopsGrid></RoutesAndStopsGrid>
    </template>
    <RoutesAndStopsMap />
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/components/DefaultLayout.vue";
import RoutesAndStopsGrid from "@/components/RoutesAndStopsGrid.vue";
import RoutesAndStopsMap from "@/components/RoutesAndStopsMap.vue";

export default {
  name: "HomeView",
  components: {
    DefaultLayout,
    RoutesAndStopsGrid,
    RoutesAndStopsMap,
  },
};
</script>
