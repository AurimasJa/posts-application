import { createLocalVue, shallowMount } from "@vue/test-utils";
import Notification from "../src/components/Notification/Notification.vue";
import Vuex from "vuex";
import NotificationsMod from "../src/store/modules/NotificationsMod";
import { expect } from "vitest";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("Notification.vue", () => {
  let store;
  let wrapper;
  let mutations = {
    ADD_NOTIFICATION: vi.fn(),
    REMOVE_NOTIFICATION: vi
      .fn()
      .mockImplementation((state, notificationToRemove) => {
        state.notifications = state.notifications.filter((notification) => {
          return notification.id != notificationToRemove.id;
        });
      }),
    REMOVE_NOTIFICATION_CLICK: vi.fn().mockImplementation((state) => {
      state.notifications.shift();
    }),
  };

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        NotificationsMod: {
          namespaced: true,
          state: NotificationsMod.state,
          getters: NotificationsMod.getters,
          mutations,
        },
      },
    });

    wrapper = shallowMount(Notification, {
      localVue,
      store,
      propsData: {
        notification: {
          type: "success",
          message: "Notification 1",
        },
      },
    });
  });

  it("renders notifications", () => {
    const notifications = wrapper.findAll(".notification");
    expect(notifications.length).toBe(1);
  });
  it("renders notification message correctly", () => {
    const notifications = wrapper.find(".break-text");
    expect(notifications.text()).toBe(wrapper.vm.notification.message);
  });
  it("notification is closed by clicking on X", async () => {
    const notificationClose = wrapper.find(".delete");
    notificationClose.trigger("click");
    await wrapper.vm.$nextTick();

    expect(mutations.REMOVE_NOTIFICATION_CLICK).toHaveBeenCalledTimes(1);
    const notifications = wrapper.findAll(".notification");
    expect(notifications.length).toBe(1);
  });
});
