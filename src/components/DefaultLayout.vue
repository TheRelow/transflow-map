<template>
  <div class="default-layout">
    <div class="default-layout__sidebar">
      <slot name="sidebar" />
    </div>
    <div class="default-layout__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.default-layout {
  display: flex;
  height: 100svh;
}

.default-layout__sidebar {
  width: 25%;
  height: 100%;
  background-color: #e8e9f3;
  overflow: auto;
}

.default-layout__content {
  width: 75%;
  height: 100%;
  overflow: hidden;
}
</style>
