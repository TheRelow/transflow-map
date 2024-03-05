<template>
  <DefaultLayout>
    <template #sidebar>
      <div class="detail-sidebar">
        <div class="detail-sidebar__top">
          <router-link to="/" class="detail-sidebar__go-back"></router-link>
          <div class="detail-sidebar__title">
            {{ routeInfo?.Description }}
          </div>
        </div>
        <div class="detail-sidebar__info" v-if="routeInfo?.ContractorName">
          <b>Перевозчик:</b> {{ routeInfo?.ContractorName }}
        </div>
      </div>
    </template>
    <div class="detail-page"></div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/components/DefaultLayout.vue";
import { mapState } from "pinia";
import { useRoutesAndStopsStore } from "@/store/routes-and-stops";

export default {
  name: "RouteDetails",
  components: {
    DefaultLayout,
  },
  computed: {
    ...mapState(useRoutesAndStopsStore, ["detailRoute"]),
    routeId() {
      return +this.$route.params.id;
    },
    routeInfo() {
      return this.detailRoute(this.routeId);
    },
  },
};
</script>

<style lang="scss">
.detail-sidebar {
  padding: 18px;
}
.detail-sidebar__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.4rem;
}
.detail-sidebar__go-back {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #bcbedf;
  cursor: pointer;
  &:before,
  &:after {
    position: absolute;
    top: calc(50% - 1px);
    left: calc(50% - 0.5rem);
    height: 2px;
    width: 1rem;
    background-color: #2b2c3d;
    transform-origin: left center;
    content: "";
  }
  &:before {
    transform: rotate(45deg);
  }
  &:after {
    transform: rotate(-45deg);
  }
}
.detail-sidebar__title {
  width: calc(100% - 4rem);
}
.detail-sidebar__info {
  margin: 24px 0;
}
.detail-page {
  padding: 24px;
}
</style>
