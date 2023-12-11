import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import Pagination from "../src/components/Pagination.vue";
import AuthorsMod from "../src/store/modules/AuthorsMod";
import { expect, vi } from "vitest";
const localVue = createLocalVue();

localVue.use(Vuex);

describe("Pagination.vue", () => {
  let state;
  let actions;
  let store;
  let wrapper;

  beforeEach(() => {
    state = {
      authorsData: [],
      totalAuthors: 5,
      authorsPaged: [],
      currentPage: 1,
      totalPages: 10,
      searchQuery: "",
    };

    actions = {
      getAuthors: vi.fn(),
      getAuthorsLimit: vi.fn(),
      postAuthor: vi.fn(),
      deleteAuthor: vi.fn(),
      updateAuthor: vi.fn(),
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
      },
    });

    wrapper = mount(Pagination, {
      localVue,
      store,
      propsData: {
        currentPage: 1,
        totalPages: 10,
      },
    });
  });

  it("set current pagination page", async () => {
    const pagination = wrapper.find("button.button.m-1.is-active");
    expect(pagination.exists()).toBe(true);
    AuthorsMod.mutations.SET_CURRENT_PAGE(state, 3);
    expect(state.currentPage).toBe(3);
  });

  it("set total pagination pages", async () => {
    const pagination = wrapper.find("button.button.m-1.is-active");
    expect(pagination.exists()).toBe(true);
    AuthorsMod.mutations.SET_TOTAL_PAGES(state, 50);
    expect(state.totalPages).toBe(50);
  });

  it("renders Pagination component", async () => {
    const pagination = wrapper.find("button.button.m-1.is-active");
    expect(pagination.exists()).toBe(true);
  });
});
