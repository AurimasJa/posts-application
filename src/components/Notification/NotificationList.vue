<template>
  <div class="notification-list">
    <Notification
      class="mt-5"
      v-for="notification in notificationsList"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script>
import Notification from "./Notification.vue";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      timerId: null,
    };
  },
  components: {
    Notification,
  },
  computed: {
    ...mapGetters("NotificationsMod", ["notificationsList"]),
  },
  methods: {
    ...mapMutations("NotificationsMod", [
      "ADD_NOTIFICATION",
      "REMOVE_NOTIFICATION",
    ]),
  },
  watch: {
    notificationsList: {
      immediate: true,
      handler: function (notifications) {
        if (notifications.length && this.timerId == null) {
          this.timerId = setInterval(() => {
            this.REMOVE_NOTIFICATION();
          }, 3000);
        } else if (!notifications.length && this.timerId != null) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
      },
    },
  },
};
</script>

<style>
.notification-list {
  position: fixed;
  right: 0;
  margin-right: 3vh;
  margin-top: 22vh;
  width: 400px;
  z-index: 1000;
}
</style>
