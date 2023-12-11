import { mount, createLocalVue } from "@vue/test-utils";
import CreatePost from "../src/components/Forms/CreatePost.vue";
import { describe, expect, it } from "vitest";
import Vuex from "vuex";

import PostsMod from "../src/store/modules/PostsMod.js";
import AuthorsMod from "../src/store/modules/AuthorsMod.js";

const localVue = createLocalVue();

localVue.use(Vuex);
describe("CreatePost.vue", () => {
  let mutations;
  let actions;
  let wrapper;
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
      postPost: vi.fn(),
    };
    store = new Vuex.Store({
      modules: {
        AuthorsMod: {
          namespaced: true,
          state: AuthorsMod.state,
          actions: AuthorsMod.actions,
          getters: {
            authorsData: () => [
              {
                name: "Author 1",
                created_at: "2022-02-02",
                updated_at: "2021-02-02",
                id: 1,
              },
              {
                name: "Author 2",
                created_at: "2022-02-02",
                updated_at: "2021-02-02",
                id: 2,
              },
            ],
            totalAuthors: () => 2,
            currentPage: () => 1,
            totalPages: () => 2,
            searchQuery: () => "",
          },
          mutations: AuthorsMod.mutations,
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
            modalName: "Create post",
            currentComponent: "CreatePost",
            currentProps: {},
          },
          mutations,
          getters: {
            modalState: vi.fn(),
            currentComponent: vi.fn(),
            modalName: vi.fn(),
            currentProps: vi.fn(),
          },
        },
      },
    });

    wrapper = mount(CreatePost, {
      localVue,
      store,
      data() {
        return {
          title: "",
          body: "",
          selectedAuthor: {
            name: "Author 1",
            created_at: "2022-02-02",
            updated_at: "2021-02-02",
            id: 1,
          },
          errors: {},
        };
      },
    });
  });

  it("Default title value empty", async () => {
    await wrapper.vm.$nextTick();
    const titleField = wrapper.find("input#title");
    expect(titleField.text()).toBe("");
  });
  it("Default body value empty", async () => {
    await wrapper.vm.$nextTick();
    const bodyField = wrapper.find("textarea#body");
    expect(bodyField.text()).toBe("");
  });
  it("Default select value empty", async () => {
    await wrapper.vm.$nextTick();
    const selectAuthor = wrapper.find("select");
    console.log();
    const author1Name =
      wrapper.vm.$store.getters["AuthorsMod/authorsData"][0].name;
    const author2Name =
      wrapper.vm.$store.getters["AuthorsMod/authorsData"][1].name;

    expect(selectAuthor.text()).toContain(
      `1. ${author1Name}  2. ${author2Name}`
    );
  });

  it("Changed input title/body should return right value", async () => {
    const titleField = wrapper.find("input#title");
    await titleField.setValue("Aladinas");
    const bodyField = wrapper.find("textarea#body");
    await bodyField.setValue("Body body body");
    const option = wrapper.find("option");

    expect(wrapper.vm.title).toBe(titleField.element.value);
    expect(wrapper.vm.body).toBe(bodyField.element.value);
    expect(wrapper.vm.selectedAuthor.name).toBe(option.element._value.name);
  });

  it("Validation is not success", async () => {
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.postPost).toHaveBeenCalledTimes(0);
  });

  it("Validation is success", async () => {
    const titleField = wrapper.find("input#title");
    await titleField.setValue("Aladinas");
    const bodyField = wrapper.find("textarea#body");
    await bodyField.setValue("Body body body");
    const option = wrapper.find("option");
    await wrapper.vm.$nextTick();
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.postPost).toHaveBeenCalledTimes(1);
  });

  it("Should close modal", async () => {
    const editButton = wrapper.find("button.button.is-danger.ml-5");
    await editButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
  });
});
