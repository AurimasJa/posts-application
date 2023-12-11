<template>
  <div>
    <div :class="typeClass" class="notification">
      <button class="delete" @click="closeNotification"></button>
      <span class="break-text">{{ notification.message }}</span>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
export default {
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("NotificationsMod", ["notificationsList"]),

    typeClass() {
      return `is-${this.notification.type}`;
    },
  },

  methods: {
    ...mapMutations("NotificationsMod", [
      "ADD_NOTIFICATION",
      "REMOVE_NOTIFICATION_CLICK",
    ]),

    closeNotification() {
      this.REMOVE_NOTIFICATION_CLICK(this.notification);
    },
  },
};
</script>

<style>
.break-text {
  word-wrap: break-word;
}
</style>
