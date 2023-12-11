import { shallowMount, createLocalVue } from "@vue/test-utils";
import Modal from "../src/components/Modal.vue";
import { beforeEach } from "vitest";
import Vuex from "vuex";
import ModalMod from "../src/store/modules/ModalMod";

const localVue = createLocalVue();

localVue.use(Vuex);
describe("SearchComponent.vue", () => {
  let state;
  let mutations;
  let store;
  let wrapper;
  beforeEach(() => {
    state = {
      modalState: false,
      modalName: null,
      currentComponent: null,
      currentProps: {},
    };
    mutations = {
      SET_MODAL_VISIBILITY: vi.fn().mockImplementation((state) => {
        state.modalState = !state.modalState;
        state.modalName = state.modalName || null;
        state.currentComponent = state.currentComponent || null;
        state.currentProps = state.currentProps || {};
      }),
    };
    store = new Vuex.Store({
      modules: {
        ModalMod: {
          namespaced: true,
          state,
          mutations,
          getters: ModalMod.getters,
        },
      },
    });

    wrapper = shallowMount(Modal, { localVue, store });
  });
  it("renders right modal name and state", async () => {
    const modal = wrapper.find(".modal");
    expect(modal.element).toBeTruthy();
  });

  it("should show modal window", () => {
    ModalMod.mutations.SET_MODAL_VISIBILITY(state, {
      component: "",
      modalName: "",
      props: "",
    });
    expect(ModalMod.getters.modalState(state)).toBe(true);
  });

  it("should render the correct title", async () => {
    ModalMod.mutations.SET_MODAL_VISIBILITY(state, {
      component: "EditAuthor",
      modalName: "Edit author",
      props: "",
    });
    await wrapper.vm.$nextTick();
    const title = wrapper.find(".modal-card-title");
    expect(title.text()).toBe(state.modalName);
  });
});
