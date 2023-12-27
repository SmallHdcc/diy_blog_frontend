<script setup>
import { pingServer } from '@/api/index.js'
import { onMounted } from 'vue'

const notificatServerState = () => {
  ElNotification({
    title: '提示',
    message: '服务器失效',
    type: 'error',
  })
}

onMounted(async () => {
  setInterval(async () => {
    const result = await pingServer()
    if (result.status > 400) {
      notificatServerState()
    }
  }, 6 * 1000)
})

</script>

<template>
  <div>
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  // position: absolute;
  // bottom: 0px;
  width: 100vw;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.5);
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
