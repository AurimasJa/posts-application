import { mount, createLocalVue } from "@vue/test-utils";
import DeleteAuthor from "../src/components/Forms/DeleteAuthor.vue";
import { describe, expect, it } from "vitest";
import Vuex from "vuex";

import AuthorsMod from "../src/store/modules/ModalMod.js";
import VueRouter from "vue-router";

const localVue = createLocalVue();
const router = new VueRouter();

localVue.use(Vuex);
localVue.use(VueRouter);

describe("DeleteAuthor.vue", () => {
  let mutations;
  let store;
  let wrapper;
  let actions;

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
      deleteAuthor: vi.fn(),
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
            modalName: "Delete author",
            currentComponent: "DeleteAuthor",
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

    wrapper = mount(DeleteAuthor, {
      localVue,
      router,
      store,
      propsData: {
        currentProps: {
          name: "Author updated",
          created_at: "2020-02-02",
          updated_at: "2021-02-02",
          id: 2,
        },
      },
    });
  });

  it("Modal with author name which should be removed", async () => {
    const authorNameParagraph = wrapper.find("p");
    const authorNameText = authorNameParagraph.text();

    expect(authorNameText).toBe(
      "Are you sure you want to remove " + wrapper.vm.authorName + "?"
    );
  });

  it("Author is removed", async () => {
    const removeButton = wrapper.find("button.button.is-danger");
    await removeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.deleteAuthor).toHaveBeenCalledTimes(1);
  });

  it("Should close modal", async () => {
    const closeButton = wrapper.find("button.button.is-warning");
    await closeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
    expect(actions.deleteAuthor).toHaveBeenCalledTimes(0);
  });
});
