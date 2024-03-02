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
    >
      <l-tile-layer :url="url" />
      <l-marker-cluster>
        <l-marker
          v-for="stop of stops"
          :key="stop.id"
          :lat-lng="{ lat: stop.lat, lng: stop.lon }"
        >
          <l-popup>
            <div>I am a popup</div>
          </l-popup>
        </l-marker>
      </l-marker-cluster>
    </l-map>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet";
import { useRoutesAndStopsStore } from "@/store/routes-and-stops";
import { mapState } from "pinia";
import Vue2LeafletMarkerCluster from "vue2-leaflet-markercluster";

export default {
  name: "RoutesAndStopsMap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
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
    ...mapState(useRoutesAndStopsStore, ["routes", "stops", "maps"]),
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
  },
};
</script>

<style lang="scss">
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
</style>
