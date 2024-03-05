<template>
  <span>{{ val() }}</span>
</template>

<script>
export default {
  name: "DirectionComponent",
  methods: {
    val() {
      return this.params.value ? "Прямое" : "Обратное";
    },
  },
};
</script>
