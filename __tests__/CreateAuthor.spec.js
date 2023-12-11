import { mount, createLocalVue } from "@vue/test-utils";
import CreateAuthor from "../src/components/Forms/CreateAuthor.vue";
import { describe, expect, it } from "vitest";
import Vuex from "vuex";

import AuthorsMod from "../src/store/modules/AuthorsMod.js";

const localVue = createLocalVue();

localVue.use(Vuex);
describe("CreateAuthor.vue", () => {
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
      postAuthor: vi.fn(),
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
        ModalMod: {
          namespaced: true,
          state: {
            modalState: true,
            modalName: "Create author",
            currentComponent: "CreateAuthor",
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

    wrapper = mount(CreateAuthor, {
      localVue,
      store,
      data() {
        return {
          authorName: "",
          errors: {},
        };
      },
    });
  });

  it("Default input value empty", async () => {
    await wrapper.vm.$nextTick();
    const inputField = wrapper.find("input#authorName");
    expect(inputField.text()).toBe("");
  });

  it("Changed input value should return right value", async () => {
    const inputField = wrapper.find("input#authorName");
    await inputField.setValue("Aladinas");
    expect(wrapper.vm.authorName).toBe(inputField.element.value);
  });

  it("Validation is not success", async () => {
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.postAuthor).toHaveBeenCalledTimes(0);
  });

  it("Validation is success", async () => {
    const inputField = wrapper.find("input#authorName");
    await inputField.setValue("Aladinas");
    await wrapper.vm.$nextTick();
    const saveButton = wrapper.find("button.button.is-success");
    await saveButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(actions.postAuthor).toHaveBeenCalledTimes(1);
  });

  it("Should close modal", async () => {
    const editButton = wrapper.find("button.button.is-danger.ml-5");
    await editButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
  });
});
