import { mount, createLocalVue } from "@vue/test-utils";
import EditAuthor from "../src/components/Forms/EditAuthor.vue";
import { describe, expect, it } from "vitest";
import Vuex from "vuex";

import AuthorsMod from "../src/store/modules/AuthorsMod.js";

const localVue = createLocalVue();

localVue.use(Vuex);
describe("EditAuthor.vue", () => {
  let mutations;
  let wrapper;
  let actions;
  let store;

  beforeEach(() => {
    mutations = {
      SET_MODAL_VISIBILITY: vi.fn().mockImplementation((state) => {
        state.modalState = !state.modalState;
        state.modalName = state.modalName || null;
        state.currentComponent = state.currentComponent || null;
        state.currentProps = state.currentProps || {};
      }),
    };

    actions = {
      updateAuthor: vi.fn(),
    };
    const author = {
      name: "Author updated",
      created_at: "2020-02-02",
      updated_at: "2021-02-02",
      id: 2,
    };
    store = new Vuex.Store({
      modules: {
        AuthorsMod: {
          namespaced: true,
          state: AuthorsMod.state,
          actions,
          getters: AuthorsMod.getters,
          mutations: AuthorsMod.mutations,
        },
        NotificationsMod: {
          namespaced: true,
          state: {
            notifications: [],
          },
          mutations: {
            ADD_NOTIFICATION: vi.fn(),
            REMOVE_NOTIFICATION: vi.fn(),
            REMOVE_NOTIFICATION_CLICK: vi.fn(),
          },
          getters: {
            notificationsList: vi.fn(),
          },
        },
        ModalMod: {
          namespaced: true,
          state: {
            modalState: true,
            modalName: "Edit author",
            currentComponent: "EditAuthor",
            currentProps: { author: author },
          },
          mutations,
          getters: {
            modalState: vi.fn(),
            currentComponent: vi.fn(),
            modalName: vi.fn(),
            currentProps: () => ({
              name: "Author updated",
              created_at: "2020-02-02",
              updated_at: "2021-02-02",
              id: 2,
            }),
          },
        },
      },
    });

    wrapper = mount(EditAuthor, {
      localVue,
      store,
      propsData: {
        currentProps: {
          name: "Author updated",
          created_at: "2020-02-02",
          updated_at: "2021-02-02",
          id: 2,
        },
      },
      data() {
        return {
          authorData: {},
          authorName: author.name,
          errors: {},
        };
      },
    });
  });
  it("Default input value author.name", async () => {
    const inputField = wrapper.find("input#authorName");
    expect(inputField.element.value).toBe(wrapper.vm.authorName);
  });

  it("Changed input value should return right value", async () => {
    const inputField = wrapper.find("input#authorName");
    await inputField.setValue("Aladinas");
    expect(wrapper.vm.authorName).toBe("Aladinas");
  });

  it("Validation is success, name is default should not update", async () => {
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.updateAuthor).toHaveBeenCalledTimes(0);
  });

  it("Validation is success", async () => {
    const inputField = wrapper.find("input#authorName");
    await inputField.setValue("Aladinas");
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.updateAuthor).toHaveBeenCalledTimes(1);
  });

  it("Validation with numbers is not success", async () => {
    const inputField = wrapper.find("input#authorName");
    await inputField.setValue("1234");
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.updateAuthor).toHaveBeenCalledTimes(0);
  });

  it("Should close modal", async () => {
    const closeButton = wrapper.find("button.button.is-danger.ml-5");
    await closeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
    expect(actions.updateAuthor).toHaveBeenCalledTimes(0);
  });
});
