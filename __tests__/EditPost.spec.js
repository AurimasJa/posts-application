import { mount, createLocalVue } from "@vue/test-utils";
import EditPost from "../src/components/Forms/EditPost.vue";
import { describe, expect, it } from "vitest";
import Vuex from "vuex";
import AuthorsMod from "../src/store/modules/AuthorsMod.js";
import PostsMod from "../src/store/modules/PostsMod.js";

const localVue = createLocalVue();

localVue.use(Vuex);
describe("EditPost.vue", () => {
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
      updatePost: vi.fn(),
    };
    const post = {
      title: "Post 1",
      body: "Post 1",
      created_at: "2020-02-02",
      updated_at: "2021-02-02",
      id: 2,
      authorId: 2,
    };
    store = new Vuex.Store({
      modules: {
        AuthorsMod: {
          namespaced: true,
          state: AuthorsMod.state,
          actions: AuthorsMod.actions,
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
        PostsMod: {
          namespaced: true,
          state: PostsMod.state,
          actions,
          getters: PostsMod.getters,
          mutations: PostsMod.mutations,
        },
        ModalMod: {
          namespaced: true,
          state: {
            modalState: true,
            modalName: "Edit post",
            currentComponent: "EditPost",
            currentProps: { post: post },
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

    wrapper = mount(EditPost, {
      localVue,
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
      data() {
        return {
          postData: {},
          title: post.title,
          body: post.body,
        };
      },
    });
  });
  it("Default title and body in edit modal", async () => {
    const inputField = wrapper.find("input.input");
    expect(inputField.element.value).toBe(wrapper.vm.title);
    const bodyField = wrapper.find("textarea.textarea");
    expect(bodyField.element.value).toBe(wrapper.vm.body);
  });

  it("Changed input value should return right value", async () => {
    const inputField = wrapper.find("input.input");
    await inputField.setValue("Aladinas");
    expect(wrapper.vm.title).toBe("Aladinas");
  });

  it("Validation is success, name is default should not update", async () => {
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.updatePost).toHaveBeenCalledTimes(0);
  });

  it("Validation is success", async () => {
    const inputField = wrapper.find("input.input");
    const bodyField = wrapper.find("textarea.textarea");
    await inputField.setValue("Aladinas");
    await bodyField.setValue("Body guard body guard");
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.updatePost).toHaveBeenCalledTimes(1);
  });

  it("Validation is not success", async () => {
    const inputField = wrapper.find("input.input");
    await inputField.setValue("1");
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.updatePost).toHaveBeenCalledTimes(0);
  });
  it("Validation with numbers is not success", async () => {
    const bodyField = wrapper.find("textarea.textarea");
    await bodyField.setValue("1");
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.updatePost).toHaveBeenCalledTimes(0);
  });

  it("Should close modal", async () => {
    const closeButton = wrapper.find("button.button.is-danger.ml-5");
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(true);
    await closeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
    expect(actions.updatePost).toHaveBeenCalledTimes(0);
  });
});
