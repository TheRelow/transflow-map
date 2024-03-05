<template>
  <span>{{ val() }}</span>
</template>

<script>
export default {
  name: "DirectionComponent",
  methods: {
    val() {
      switch (this.params.value) {
        case true:
          return "Прямое";
        case false:
          return "Обратное";
        default:
          return "";
      }
    },
  },
};
</script>
