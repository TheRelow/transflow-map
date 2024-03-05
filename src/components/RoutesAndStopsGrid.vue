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
      :rowSelection="rowSelection"
      :allowContextMenuWithControlKey="true"
      :getContextMenuItems="getContextMenuItems"
      @selection-changed="onSelectionChanged"
      @grid-ready="onGridReady"
      @rowDataUpdated="rowDataUpdated"
    />
  </div>
</template>

<script>
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { AgGridVue } from "ag-grid-vue";
import { useRoutesAndStopsStore } from "@/store/routes-and-stops";
import { mapState, mapActions } from "pinia";

export default {
  name: "RoutesAndStopsGrid",
  components: {
    AgGridVue,
  },
  data() {
    return {
      routeColumns: [
        {
          field: "title",
          headerName: "Название маршрута",
          resizable: false,
          sortable: false,
          flex: 1,
        },
      ],
      stopColumns: [
        {
          field: "name",
          headerName: "Название остановки",
          resizable: false,
          sortable: false,
          flex: 1,
        },
      ],
      rowSelection: "single",
      gridApi: null,
    };
  },
  computed: {
    ...mapState(useRoutesAndStopsStore, [
      "routes",
      "stops",
      "maps",
      "activeMap",
      "activeStopId",
      "activeRouteId",
    ]),
    columnDefs() {
      switch (this.activeMap) {
        case "routes":
          return this.routeColumns;
        case "stops":
          return this.stopColumns;
        default:
          return [];
      }
    },
    rowData() {
      switch (this.activeMap) {
        case "routes":
          return this.routes;
        case "stops":
          return this.stops;
        default:
          return [];
      }
    },
  },
  methods: {
    ...mapActions(useRoutesAndStopsStore, [
      "changeMap",
      "changeActiveStop",
      "changeActiveRoute",
    ]),
    onSelectionChanged() {
      const selectedRows = this.gridApi.getSelectedRows();
      if (this.activeMap === "stops" && selectedRows.length === 1) {
        this.changeActiveStop(selectedRows[0].id);
      } else if (this.activeMap === "routes" && selectedRows.length === 1) {
        this.changeActiveRoute(selectedRows[0].id);
      }
    },
    onGridReady(params) {
      this.gridApi = params.api;
      this.gridApi.setGridOption("rowData", this.rowData);
    },
    checkActiveStopId() {
      this.gridApi?.forEachNode((node) => {
        if (node.data.id === this.activeStopId) {
          node.setSelected(true);
          this.gridApi.ensureNodeVisible(node, "middle");
        }
      });
    },
    checkActiveRouteId() {
      this.gridApi?.forEachNode((node) => {
        if (node.data.id === this.activeRouteId) {
          node.setSelected(true);
          this.gridApi.ensureNodeVisible(node, "middle");
        }
      });
    },
    rowDataUpdated() {
      switch (this.activeMap) {
        case "routes":
          this.checkActiveRouteId();
          break;
        case "stops":
          this.checkActiveStopId();
          break;
        default:
          return [];
      }
    },
    getContextMenuItems(params) {
      let result = [
        {
          // custom item
          name: "Подробно",
          action: () => {
            if (params.node.data.id) {
              this.$router.push(`/route/${params.node.data.id}`);
            }
          },
        },
      ];
      if (this.activeMap === "routes") {
        return result;
      }
    },
  },
  watch: {
    activeStopId(val) {
      if (val) {
        this.checkActiveStopId();
      } else {
        this.gridApi.deselectAll();
      }
    },
    activeRouteId(val) {
      if (val) {
        this.checkActiveRouteId();
      } else {
        this.gridApi.deselectAll();
      }
    },
    rowData(val) {
      this.gridApi.setGridOption("rowData", val);
    },
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
