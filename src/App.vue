<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import navigation from '@/components/navigation/navigation.vue';

</script>

<template>
  <div>
    <navigation />
    <router-view v-slot="{ Component }">
      <transition name="slide-fade">
        <component :is="Component" />
      </transition>
    </router-view>

    <div id="footer">
      <a href="https://beian.miit.gov.cn/#/Integrated/index">鄂ICP备2023017019号</a>
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=42018502006927" rel="noreferrer" target="_blank">
        <span><img src="/img/备案图标.png" alt=""></span>鄂公网安备42018502006927</a>
    </div>

  </div>
</template>

<style lang="less" scoped>
@import './assets/font/font.css';

div {
  font-family: xiawu;
  overflow: hidden;
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

#footer {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // position: absolute;
  // bottom: 0px;
  width: 100%;
  height: 100px;
  background-color: rgb(236, 236, 236);
  // background-color: pink;
  // margin-top: 10px;
  text-align: center;

  a:hover {
    color: rgb(64, 158, 255);
  }

  img {
    width: 16px;
    height: 16px;
    line-height: 16px;
  }
}
</style>
