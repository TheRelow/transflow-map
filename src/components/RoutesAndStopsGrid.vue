<template>
  <div class="routes-and-stops">
    <div class="switcher">
      <div
        class="switcher__el"
        :class="{ active: item.isActive }"
        v-for="item of maps"
        :key="item.type"
        @click="changeMap(item.type)"
      >
        {{ item.name }}
      </div>
    </div>
    <ag-grid-vue
      class="ag-theme-quartz routes-and-stops__grid"
      :columnDefs="columnDefs"
      :rowData="routes"
    >
    </ag-grid-vue>
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { AgGridVue } from "ag-grid-vue";
import { useRoutesAndStopsStore } from "@/store/routes-and-stops";
import { mapState, mapActions } from "pinia";

export default {
  name: "RoutesAndStopsGrid",
  data() {
    return {
      columnDefs: [
        {
          field: "title",
        },
        {
          field: "stopsCount",
        },
      ],
      rowData: null,
    };
  },
  components: {
    AgGridVue,
  },
  computed: {
    ...mapState(useRoutesAndStopsStore, ["routes", "stops", "maps"]),
  },
  methods: {
    ...mapActions(useRoutesAndStopsStore, ["changeMap"]),
  },
};
</script>

<style lang="scss">
.routes-and-stops {
  width: 100%;
  height: 100%;
}

// Switcher
.switcher {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 100%;
  background-color: #fff;
}
.switcher__el {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  cursor: pointer;
  &:before {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #000;
    transition: 0.2s;
    content: "";
  }
  &:not(:last-child) {
    border-right: 1px solid #000;
  }
  &.active {
    &:before {
      height: 4px;
    }
  }
}

// Grid
.routes-and-stops__grid {
  height: calc(100% - 60px);
  .ag-root-wrapper {
    border-radius: 0;
  }
}
</style>
