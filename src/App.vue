<template>
  <div id="app" class="container">
    <NotificationList />
    <div class="container">
      <NavBar></NavBar>
      <router-view></router-view>
      <Modal />
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import NotificationList from "./components/Notification/NotificationList.vue";
import Modal from "./components/Modal.vue";
export default {
  components: {
    NavBar,
    NotificationList,
    Modal,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f1f1f1;
  min-height: 100vh;
}
</style>
