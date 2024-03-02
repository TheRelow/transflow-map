<template>
  <div class="page-loading">
    <blocks-loader />
    <ProgressLoader v-if="progress !== false" :progress="progress" />
    <slot />
  </div>
</template>

<script>
import BlocksLoader from "./BlocksLoader.vue";
import ProgressLoader from "./ProgressLoader.vue";

export default {
  name: "PageLoading",
  components: {
    BlocksLoader,
    ProgressLoader,
  },
  props: {
    progress: {
      type: [Number, Boolean],
      default: 0,
    },
  },
};
</script>

<style lang="scss">
.page-loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  background-color: #fff;
}
</style>
