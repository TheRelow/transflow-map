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
        <div class="detail-sidebar__info" v-if="routeInfo">
          <p v-if="routeInfo.ContractorName">
            <b>Перевозчик:</b> {{ routeInfo.ContractorName }}
          </p>
          <p v-if="routeInfo.contractorName">
            <b>Остановок в прямом направлении:</b>
            {{ routeInfo.forwardStopsCount }}
          </p>
          <p v-if="routeInfo.contractorName">
            <b>Остановок в обратном направлении:</b>
            {{ routeInfo.backwardStopsCount }}
          </p>
        </div>
      </div>
    </template>
    <div class="detail-page">
      <ag-grid-vue
        class="ag-theme-quartz stops-grid"
        :columnDefs="columnDefs"
        :rowData="routeInfo.Stops"
        :getRowStyle="getRowStyle"
      />
    </div>
  </DefaultLayout>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue";
import DefaultLayout from "@/components/DefaultLayout.vue";
import { mapState } from "pinia";
import { useRoutesAndStopsStore } from "@/store/routes-and-stops";

export default {
  name: "RouteDetails",
  components: {
    DefaultLayout,
    AgGridVue,
  },
  data() {
    return {
      columnDefs: [
        {
          field: "Name",
          headerName: "Название остановки",
          resizable: false,
          sortable: false,
          flex: 1,
        },
      ],
    };
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
  methods: {
    getRowStyle(params) {
      let result = {
        background: "rgb(213, 222, 255)",
      };
      if (params.data.Forward === false)
        result.background = "rgb(255, 213, 213)";
      return result;
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
  height: calc(100% - 48px);
  padding: 24px;
}
.stops-grid {
  height: 100%;
}
</style>
