<script setup>
import navigation from '@/components/navigation/navigation.vue';

</script>

<template>
  <div id="app">
    <navigation />
    <router-view v-slot="{ Component }">
      <transition name="slide-fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style lang="less" scoped>
@import './assets/font/font.css';

#app {
  width: 100%;
  height: 10vh;
  font-family: xiawu;

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
