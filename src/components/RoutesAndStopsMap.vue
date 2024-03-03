<template>
  <div style="height: 100%; width: 100%">
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="height: 100%"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
      ref="map"
    >
      <l-tile-layer :url="url" />
      <l-marker-cluster>
        <l-marker
          v-for="stop of stops"
          :key="stop.id"
          :lat-lng="{ lat: stop.lat, lng: stop.lon }"
          :visible="activeStopId ? stop.id === activeStopId : true"
          @click="selectStop(stop.id)"
        >
        </l-marker>
      </l-marker-cluster>
      <l-polyline
        v-for="route of routes"
        :key="route.id"
        :routeId="route.id"
        :lat-lngs="route.points"
        color="green"
        :visible="
          activeMap === 'routes' &&
          (!activeRouteId || activeRouteId === route.id)
        "
        @click="changeActiveRoute(route.id)"
        ref="route-line"
      ></l-polyline>
      <l-control v-if="activeStopId" position="bottomleft">
        <button class="show-all" @click="changeActiveStop(null)">
          Отобразить все остановки
        </button>
      </l-control>
      <l-control v-if="activeRouteId" position="bottomleft">
        <button class="show-all" @click="changeActiveRoute(null)">
          Отобразить все маршруты
        </button>
      </l-control>
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPolyline, LControl } from "vue2-leaflet";
import { useRoutesAndStopsStore } from "@/store/routes-and-stops";
import { mapState, mapActions } from "pinia";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

export default {
  name: "RoutesAndStopsMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPolyline,
    LControl,
    "l-marker-cluster": Vue2LeafletMarkerCluster,
  },
  data() {
    return {
      zoom: 13,
      center: latLng(57.288915, 55.472213),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      withPopup: latLng(57.288915, 55.472213),
      currentZoom: 11.5,
      currentCenter: latLng(57.288915, 55.472213),
      mapOptions: {
        zoomSnap: 0.5,
      },
      showMap: true,
    };
  },
  computed: {
    ...mapState(useRoutesAndStopsStore, [
      "routes",
      "stops",
      "maps",
      "activeStopId",
      "activeRouteId",
      "activeMap",
    ]),
  },
  methods: {
    ...mapActions(useRoutesAndStopsStore, [
      "changeActiveStop",
      "changeActiveRoute",
      "changeMap",
    ]),
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    selectStop(id) {
      this.changeMap("stops");
      this.changeActiveStop(id);
    },
  },
  watch: {
    activeStopId(id) {
      const stop = this.stops.find((el) => el.id === id);
      if (stop) {
        this.center = {
          lat: stop.lat,
          lng: stop.lon,
        };
      }
    },
    activeRouteId(id) {
      const idx = this.$refs["route-line"].findIndex(
        (el) => el.$attrs.routeId === id
      );
      if (idx !== -1) {
        this.$refs.map.mapObject.fitBounds(
          this.$refs["route-line"][idx].mapObject.getBounds()
        );
      }
    },
  },
};
</script>

<style lang="scss">
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";

.show-all {
  min-width: 200px;
  height: 60px;
}
</style>
