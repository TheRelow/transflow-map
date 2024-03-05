<template>
  <div class="progress-loader">
    <div
      class="progress-loader__proggress"
      :style="`width: ${progressNumber}%`"
    ></div>
    <div class="progress-loader__text">{{ progressNumber }} %</div>
  </div>
</template>

<script>
export default {
  name: "ProgressLoader",
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    progressNumber() {
      if (typeof this.progress === "number") {
        if (this.progress >= 0 && this.progress <= 100) {
          return this.progress;
        } else if (this.progress > 100) {
          return 100;
        }
      }
      return 0;
    },
  },
};
</script>

<style lang="scss">
.progress-loader {
  position: relative;
  height: 24px;
  width: 320px;
  border-radius: 12px;
  background-color: #819bb4;
}
.progress-loader__proggress {
  height: 100%;
  min-width: 24px;
  border-radius: 12px;
  background-color: #2c3e50;
  transition: 0.2s;
}
.progress-loader__text {
  position: absolute;
  top: calc(50% + 1px);
  left: 50%;
  color: #fff;
  transform: translate(-50%, -50%);
}
</style>
