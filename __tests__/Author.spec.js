import { shallowMount, mount, createLocalVue } from "@vue/test-utils";
import Author from "../src/components/Authors/Author.vue";
import { describe, it } from "vitest";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
describe("Author.vue", () => {
  let mutations;
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
    store = new Vuex.Store({
      modules: {
        ModalMod: {
          namespaced: true,
          state: {
            modalState: false,
            modalName: null,
            currentComponent: null,
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
    const author = {
      name: "Author updated",
      created_at: "2020-02-02",
      updated_at: "2021-02-02",
      id: 2,
    };

    wrapper = mount(Author, {
      localVue,
      store,
      propsData: {
        author: author,
      },
    });
  });

  it("created author display", () => {
    const author = {
      name: "Author created",
      created_at: "2022-02-02",
      updated_at: "2021-02-02",
      id: 1,
    };

    const wrapper = shallowMount(Author, {
      propsData: {
        author: author,
      },
    });
    const created = wrapper.find("p.subtitle.is-7");

    expect(wrapper.props().author).toContain(author);
    expect(wrapper.find("p.title.is-6").exists()).toBe(true);
    expect(wrapper.find("span.title.is-6").exists()).toBe(true);
    expect(wrapper.find("span.title.is-6").text()).toBe(author.name);
    expect(
      author.created_at <= author.updated_at
        ? created.text("Updated at: 2021-02-02")
        : created.text("Created at: 2022-02-02")
    ).toBe("Created at: " + author.created_at);

    expect(wrapper.find("button.button.is-warning").exists()).toBe(true);
    expect(wrapper.find("button.button.is-danger.ml-3").exists()).toBe(true);
  });

  it("updated author display", () => {
    const author2 = {
      name: "Author updated",
      created_at: "2020-02-02",
      updated_at: "2021-02-02",
      id: 2,
    };

    const wrapper = shallowMount(Author, {
      propsData: {
        author: author2,
      },
    });

    const update = wrapper.find("p.subtitle.is-7");

    expect(wrapper.props().author).toContain(author2);
    expect(wrapper.find("p.title.is-6").exists()).toBe(true);
    expect(wrapper.find("span.title.is-6").exists()).toBe(true);
    expect(wrapper.find("span.title.is-6").text()).toBe(author2.name);
    expect(
      author2.created_at <= author2.updated_at
        ? update.text("Updated at: 2021-02-02")
        : update.text("Created at: 2020-02-02")
    ).toBe("Updated at: " + author2.updated_at);

    expect(wrapper.find("button.button.is-warning").exists()).toBe(true);
    expect(wrapper.find("button.button.is-danger.ml-3").exists()).toBe(true);
  });

  it("Should call edit button once", async () => {
    const editButton = wrapper.find("button.button.is-warning");
    await editButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(true);
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
  });
  it("Should call edit button twice", async () => {
    const editButton = wrapper.find("button.button.is-warning");
    await editButton.trigger("click");
    await editButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(2);
  });

  it("Should call delete button once", async () => {
    const deleteButton = wrapper.find("button.button.is-danger.ml-3");
    await deleteButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(true);
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
  });
});
