const state = {
  notifications: [],
};

const mutations = {
  ADD_NOTIFICATION(state, notification) {
    state.notifications.push({
      ...notification,
      id: (Math.random() + Date.now()).toString().substring(3),
    });
  },

  REMOVE_NOTIFICATION_CLICK(state, notificationToRemove) {
    state.notifications = state.notifications.filter((notification) => {
      return notification.id != notificationToRemove.id;
    });
  },

  REMOVE_NOTIFICATION(state) {
    state.notifications.shift();
  },
};

const getters = {
  notificationsList(state) {
    return state.notifications;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
