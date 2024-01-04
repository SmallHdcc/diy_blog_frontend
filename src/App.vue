<script setup>
import { onMounted, onUnmounted } from 'vue'
const notificatServerState = () => {
  ElNotification({
    title: '提示',
    message: '服务器失效',
    type: 'error',
  })
}
const socket = new WebSocket('ws://localhost:8081/websocket') // 替换为你的 Spring Boot 服务器的地址和端口号

onMounted(() => {
  socket.onopen = () => {
    console.log('Connected to server');
  }

  //发送心跳包
  setInterval(() => {
    if (socket.readyState == WebSocket.OPEN)
      socket.send('heartbeat');
  }, 10000);
  //接收消息
  socket.onmessage = (message) => {
    if (message.data != "heartbeat") {
      notificatServerState()
    }
  }

  socket.onerror = (error) => {
    notificatServerState();
  }
  socket.onclose = () => {
    console.log('Disconnected from server');
    notificatServerState();
  }
})

onUnmounted(() => {
  socket.close();
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
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // position: absolute;
  // bottom: 0px;
  width: 100%;
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
