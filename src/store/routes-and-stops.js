import { defineStore } from "pinia";
import axios from "axios";
import data from "@/prepared-data/routes-and-stops.json";

export const useRoutesAndStopsStore = defineStore("routesAndStops", {
  state: () => ({
    routesAndStops: [],
    isLoading: false,
    isPreparingStops: false,
    loadingProgress: null,
    maps: [
      {
        name: "Маршруты",
        type: "routes",
        isActive: true,
      },
      {
        name: "Остановки",
        type: "stops",
        isActive: false,
      },
    ],
    activeStopId: null,
  }),
  getters: {
    routes: (state) => {
      return state.routesAndStops.map((el) => ({
        id: el.ID,
        title: el.Description,
        stops: el.Stops.map((stop) => stop.ID),
        stopsCount: el.Stops.reduce((p) => p + 1, 0),
      }));
    },
    stops: (state) => {
      state.isPreparingStops = true;
      const result = state.routesAndStops
        .map((el) => el.Stops)
        .reduce((p, c) => {
          c.forEach((stop) => {
            const idx = p.findIndex((i) => i.id === stop.ID);
            if (idx === -1) {
              p.push({
                id: stop.ID,
                lon: stop.Lon,
                lat: stop.Lat,
                name: stop.Name,
              });
            }
          });
          return p;
        }, []);
      state.isPreparingStops = false;
      return result;
    },
    activeMap: (state) => state.maps.find((i) => i.isActive === true).type,
  },
  actions: {
    usePreparedData() {
      this.routesAndStops = data;
    },
    async fetchRoutesAndStops() {
      try {
        this.isLoading = true;
        const total = 34037917;
        const res = await axios.get(
          "https://220.transflow.ru/api/public/v1/routes_data?key=012345678abc",
          {
            onDownloadProgress: (progressEvent) => {
              const current = progressEvent.loaded;
              let percentCompleted = Math.floor((current / total) * 100);
              this.loadingProgress = percentCompleted;
            },
          }
        );
        this.routesAndStops = res.data;
        this.isLoading = false;
        this.loadingProgress = null;
        return res;
      } catch (error) {
        this.isLoading = false;
        this.loadingProgress = null;
        console.error(`Error while fetching`, error);
        throw error;
      }
    },
    changeMap(map) {
      const beforeChange = [...this.maps];
      this.maps.forEach((el, idx) => (this.maps[idx].isActive = false));
      const idx = this.maps.findIndex((el) => el.type === map);
      if (idx !== -1) {
        this.maps[idx].isActive = true;
      } else {
        this.maps = beforeChange;
        throw "Карты такого типа не существует";
      }
    },
    changeActiveStop(id) {
      this.activeStopId = id;
    },
  },
});
