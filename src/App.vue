<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import navigation from '@/components/navigation/navigation.vue';
const notificatServerState = () => {
  ElNotification({
    title: '提示',
    message: '服务器失效',
    type: 'error',
  })
}

const socket = ref(null)

socket.value = new WebSocket('ws://localhost:8081/websocket')
// const socket = new WebSocket('ws://82.157.251.19:8081/websocket')
provide('socket', socket)

onMounted(() => {
  socket.value.onopen = () => {
    console.log('Connected to server')
    //如果userId存在则发送userId
    const userId = localStorage.getItem("baseInfo") ? JSON.parse(localStorage.getItem("baseInfo")).id : null
    if (userId) {
      socket.value.send(userId);
    }
    //发送心跳包
    setInterval(() => {
      if (socket.value.readyState == WebSocket.OPEN)
        socket.value.send('heartbeat');
    }, 10000);
  }

  //接收消息
  socket.value.onmessage = (message) => {
    if (message.data != "heartbeat") {
      notificatServerState()
    }
  }

  socket.value.onerror = (error) => {
    notificatServerState();
  }
  socket.value.onclose = () => {
    console.log('Disconnected from server');
  }
})

onUnmounted(() => {
  socket.value.close();
})

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
