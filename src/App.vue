<script setup>
import navigation from '@/components/navigation/navigation simple.vue';

</script>

<template>
  <div id="app">
    <navigation />
    <video src="/img/ghibliLofiCoffee.mp4" autoplay="autoplay" loop="loop" muted="muted"></video>
    <router-view v-slot="{ Component }">
      <!-- <transition name="slide-fade"> -->
      <component :is="Component" />
      <!-- </transition> -->
    </router-view>
  </div>
</template>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100vh;
}

video {
  position: fixed;
  width: 100%;
  height: auto;
  object-fit: cover;
  top: 0;
  left: 0;
  background-attachment: fixed;
  background-size: cover;
  z-index: -1;
}

.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  position: absolute;
  transform: translateX(20px);
  opacity: 0;
}
</style>
