import { mount, createLocalVue } from "@vue/test-utils";
import DeletePost from "../src/components/Forms/DeletePost.vue";
import { describe, expect, it } from "vitest";
import Vuex from "vuex";
import PostsMod from "../src/store/modules/PostsMod.js";
import VueRouter from "vue-router";

const localVue = createLocalVue();
const router = new VueRouter();

localVue.use(Vuex);
localVue.use(VueRouter);

describe("DeletePost.vue", () => {
  let mutations;
  let wrapper;
  let store;
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
      deletePost: vi.fn(),
    };
    const author = {
      name: "Author updated",
      created_at: "2020-02-02",
      updated_at: "2021-02-02",
      id: 2,
    };
    store = new Vuex.Store({
      modules: {
        PostsMod: {
          namespaced: true,
          state: PostsMod.state,
          actions,
          getters: PostsMod.getters,
          mutations: PostsMod.mutations,
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
            currentComponent: "DeletePost",
            currentProps: { author: author },
          },
          mutations,
          getters: {
            modalState: vi.fn(),
            currentComponent: vi.fn(),
            modalName: vi.fn(),
            currentProps: () => ({
              title: "Post 1",
              body: "Body 1asdsadsdasda",
              created_at: "2020-02-02",
              updated_at: "2021-02-02",
              id: 2,
              authorId: 2,
            }),
          },
        },
      },
    });

    wrapper = mount(DeletePost, {
      localVue,
      router,
      store,
      propsData: {
        currentProps: {
          title: "Post 1",
          body: "Body 1asdsadsdasda",
          created_at: "2020-02-02",
          updated_at: "2021-02-02",
          id: 2,
          authorId: 2,
        },
      },
    });
  });

  it("Modal with post title which should be removed", async () => {
    const postTitleParagraph = wrapper.find("p");
    const postTitleText = postTitleParagraph.text();

    expect(postTitleText).toBe(
      "Are you sure you want to remove " + wrapper.vm.title + "?"
    );
  });

  it("Author is removed", async () => {
    const removeButton = wrapper.find("button.button.is-danger");
    await removeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.deletePost).toHaveBeenCalledTimes(1);
  });

  it("Should close modal", async () => {
    const closeButton = wrapper.find("button.button.is-warning");
    await closeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
    expect(actions.deletePost).toHaveBeenCalledTimes(0);
  });
});
