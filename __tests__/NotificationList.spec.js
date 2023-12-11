import { mount, createLocalVue } from "@vue/test-utils";
import NotificationList from "../src/components/Notification/NotificationList.vue";
import Vuex from "vuex";
import NotificationsMod from "../src/store/modules/NotificationsMod";
import { expect } from "vitest";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("NotificationsList.vue", () => {
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
          state: {
            notifications: [
              { id: 1, message: "Notification 1", type: "danger" },
              { id: 2, message: "Notification 2", type: "success" },
            ],
          },
          getters: NotificationsMod.getters,
          mutations,
        },
      },
    });

    wrapper = mount(NotificationList, {
      localVue,
      store,
    });
  });

  it("renders notifications", () => {
    const notifications = wrapper.findAll(".notification");
    expect(notifications.length).toBe(2);
  });

  it("first notification is Notification 1", () => {
    const notifications = wrapper.find(".notification");
    expect(wrapper.vm.notificationsList[0].message).toBe(notifications.text());
  });
  it("notification is closed by clicking on X", async () => {
    const notificationClose = wrapper.find(".delete");
    notificationClose.trigger("click");
    await wrapper.vm.$nextTick();

    expect(mutations.REMOVE_NOTIFICATION_CLICK).toHaveBeenCalledTimes(1);
    const notifications = wrapper.findAll(".notification");
    expect(notifications.length).toBe(1);
  });
  it("should be clicked twice on X", async () => {
    const notificationClose = wrapper.find(".delete");
    notificationClose.trigger("click");
    await wrapper.vm.$nextTick();
    notificationClose.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.REMOVE_NOTIFICATION_CLICK).toHaveBeenCalledTimes(2);
  });
});
