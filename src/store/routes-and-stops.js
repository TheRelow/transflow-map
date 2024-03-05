import { defineStore } from "pinia";
import axios from "axios";
import data from "@/prepared-data/routes-and-stops-mini.json";
import { v4 as uuidv4 } from "uuid";

export const useRoutesAndStopsStore = defineStore("routesAndStops", {
  state: () => ({
    mapCenter: null,
    mapZoom: null,
    routesAndStops: [],
    isLoading: false,
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
    activeRouteId: null,
    routes: [],
    stops: [],
  }),
  getters: {
    activeMap: (state) => state.maps.find((i) => i.isActive === true).type,
    detailRoute: (state) => (id) => {
      const idx = state.routes.findIndex((el) => el.id === id);
      if (idx !== -1) {
        return state.routes[idx];
      } else {
        console.warn("Такого маршрута нет");
        return {};
      }
    },
    activeRouteStops: (state) => {
      let result = [];
      if (state.activeRouteId) {
        const idx = state.routes.findIndex(
          (el) => el.id === state.activeRouteId
        );
        if (idx !== -1) {
          result = state.routes[idx].stops.map((el) => el.id);
        }
      }
      return result;
    },
  },
  actions: {
    setRoutes(data) {
      this.routes = data.map((el) => ({
        id: el.ID,
        title: el.Description,
        stops: el.Stops.map((stop) => ({
          id: stop.ID,
          forward: stop.Forward,
          name: stop.Name,
        })),
        forwardStopsCount: el.Stops.reduce((p, c) => {
          if (c.Forward) {
            return p + 1;
          }
          return p;
        }, 0),
        backwardStopsCount: el.Stops.reduce((p, c) => {
          if (!c.Forward) {
            return p + 1;
          }
          return p;
        }, 0),
        firstStopId: el.FirstStopId,
        lastStopId: el.LastStopId,
        contractorName: el.ContractorName,
        points: el.Points?.map((point) => [point.Lat, point.Lon]) || [],
      }));
    },
    setStops(data) {
      const result = data
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
                forward: stop.Forward,
              });
            } else if (!p[idx].forward && stop.Forward === true) {
              p[idx].forward = stop.Forward;
            }
          });
          return p;
        }, []);
      this.stops = result;
    },
    usePreparedData() {
      this.setRoutes(data);
      this.setStops(data);
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
        this.setRoutes(res.data);
        this.setStops(res.data);
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
        this.activeStopId = null;
      } else {
        this.maps = beforeChange;
        throw "Карты такого типа не существует";
      }
    },
    changeActiveStop(id) {
      this.activeRouteId = null;
      this.activeStopId = id;
    },
    changeActiveRoute(id) {
      this.activeStopId = null;
      this.activeRouteId = id;
    },
    createStop(data) {
      console.log("data", data);
      this.stops.push({ ...data, id: uuidv4() });
    },
    setMapCenter(center) {
      this.mapCenter = center;
    },
    setMapZoom(zoom) {
      this.mapZoom = zoom;
    },
  },
});
