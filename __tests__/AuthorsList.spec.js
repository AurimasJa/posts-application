import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import AuthorsList from "../src/components/Authors/AuthorsList.vue";
import AuthorsMod from "../src/store/modules/AuthorsMod";
import { expect, vi } from "vitest";
const localVue = createLocalVue();

localVue.use(Vuex);

describe("AuthorsList.vue", () => {
  let state;
  let actions;
  let mutations;
  let store;
  let wrapper;

  beforeEach(() => {
    state = {
      authorsData: [
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
        {
          name: "Author 3",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 3,
        },
        {
          name: "Author 4",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 4,
        },
        {
          name: "Author 5",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 5,
        },
      ],
      totalAuthors: 5,
      authorsPaged: [
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
        {
          name: "Author 3",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 3,
        },
      ],
      currentPage: 1,
      totalPages: 2,
      searchQuery: "",
    };

    actions = {
      getAuthors: vi.fn(),
      getAuthorsLimit: vi.fn(),
      postAuthor: vi.fn(),
      deleteAuthor: vi.fn(),
      updateAuthor: vi.fn(),
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
        AuthorsMod: {
          namespaced: true,
          state,
          actions,
          getters: AuthorsMod.getters,
          mutations: AuthorsMod.mutations,
        },
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

    wrapper = mount(AuthorsList, { localVue, store });
  });

  it("renders Search component", async () => {
    const searchInput = wrapper.find(
      '.field.has-addons.is-justify-content-center .control input[type="text"]'
    );
    expect(searchInput.exists()).toBe(true);
  });

  it("renders Pagination component", async () => {
    const pagination = wrapper.find("button.button.m-1.is-active");
    expect(pagination.exists()).toBe(true);
  });

  it("Renders authors when authorsData are present", async () => {
    const allAuthors = wrapper.findAll("div.card-content.max-height");
    expect(allAuthors).toHaveLength(wrapper.vm.authorsPaged.length);
  });

  it("Renders author name and date in the first card", async () => {
    await localVue.nextTick();
    const authorOneComponent = wrapper.find("div.card-content.max-height");
    expect(authorOneComponent.text()).toBe(
      "Name: " +
        wrapper.vm.authorsPaged[0].name +
        " Created at: " +
        wrapper.vm.authorsPaged[0].created_at
    );
  });

  it("Does not render div v-else when authors present", async () => {
    const div = wrapper.find("div.subtitle.is-5.mt-5.is-vcentered");
    expect(div.exists()).toBe(false);
  });

  it("Renders div v-else when authors are not present", async () => {
    wrapper.vm.$store.state.AuthorsMod.authorsPaged = 0;
    wrapper.vm.$store.state.AuthorsMod.totalAuthors = 0;
    wrapper.vm.$store.state.AuthorsMod.currentPage = 0;
    wrapper.vm.$store.state.AuthorsMod.authorsData = 0;
    wrapper.vm.$store.state.AuthorsMod.totalPages = 0;
    await wrapper.vm.$nextTick();

    const div = wrapper.find("div.subtitle.is-5.mt-5.is-vcentered");
    expect(div.exists()).toBe(true);
  });

  it("Does not render pagination when authors are not present", async () => {
    wrapper.vm.$store.state.AuthorsMod.authorsPaged = 0;
    wrapper.vm.$store.state.AuthorsMod.totalAuthors = 0;
    wrapper.vm.$store.state.AuthorsMod.currentPage = 0;
    wrapper.vm.$store.state.AuthorsMod.authorsData = 0;
    wrapper.vm.$store.state.AuthorsMod.totalPages = 0;
    await wrapper.vm.$nextTick();

    const pagination = wrapper.find("button.button.m-1.is-active");
    expect(pagination.exists()).toBe(false);
  });

  it("Renders edit and remove buttons when authors are present", async () => {
    const editButton = wrapper.find("button.button.is-warning");
    expect(editButton.exists()).toBe(true);
    const deleteButton = wrapper.find("button.button.is-danger.ml-3");
    expect(deleteButton.exists()).toBe(true);
  });

  it("Renders edit and remove buttons when authors are not present", async () => {
    wrapper.vm.$store.state.AuthorsMod.authorsPaged = 0;
    wrapper.vm.$store.state.AuthorsMod.totalAuthors = 0;
    wrapper.vm.$store.state.AuthorsMod.currentPage = 0;
    wrapper.vm.$store.state.AuthorsMod.authorsData = 0;
    wrapper.vm.$store.state.AuthorsMod.totalPages = 0;
    await wrapper.vm.$nextTick();

    const editButton = wrapper.find("button.button.is-warning");
    expect(editButton.exists()).toBe(false);
    const deleteButton = wrapper.find("button.button.is-danger.ml-3");
    expect(deleteButton.exists()).toBe(false);
  });
});
