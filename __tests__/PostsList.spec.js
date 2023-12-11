import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import PostsList from "../src/components/Posts/PostsList.vue";
import PostsMod from "../src/store/modules/PostsMod";
import { expect, vi } from "vitest";
import VueRouter from "vue-router";

const localVue = createLocalVue();
const router = new VueRouter();

localVue.use(Vuex);
localVue.use(VueRouter);

describe("PostsList.vue", () => {
  let state;
  let actions;
  let mutations;
  let store;
  let wrapper;

  beforeEach(() => {
    state = {
      posts: [
        {
          title: "Post 1",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 1,
          authorId: 1,
          author: {
            name: "Author 1",
            created_at: "2022-02-02",
            updated_at: "2021-02-02",
            id: 1,
          },
        },
        {
          title: "Post 2",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 2,
          authorId: 1,
          author: {
            name: "Author 1",
            created_at: "2022-02-02",
            updated_at: "2021-02-02",
            id: 1,
          },
        },
        {
          title: "Post 3",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 3,
          authorId: 1,
          author: {
            name: "Author 1",
            created_at: "2022-02-02",
            updated_at: "2021-02-02",
            id: 1,
          },
        },
        {
          title: "Post 4",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 4,
          authorId: 1,
          author: {
            name: "Author 1",
            created_at: "2022-02-02",
            updated_at: "2021-02-02",
            id: 1,
          },
        },
        {
          title: "Post 5",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 5,
          authorId: 1,
          author: {
            name: "Author 1",
            created_at: "2022-02-02",
            updated_at: "2021-02-02",
            id: 1,
          },
        },
      ],
      singlePost: {
        name: "Post 5",
        created_at: "2022-02-02",
        updated_at: "2021-02-02",
        id: 5,
        authorId: 1,
        author: {
          name: "Author 1",
          created_at: "2022-02-02",
          updated_at: "2021-02-02",
          id: 1,
        },
      },
      totalPosts: 5,
      currentPage: 1,
      totalPages: 3,
      searchQuery: "",
    };

    actions = {
      getPosts: vi.fn(),
      postPost: vi.fn(),
      updatePost: vi.fn(),
      deletePost: vi.fn(),
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
        PostsMod: {
          namespaced: true,
          state,
          actions,
          getters: PostsMod.getters,
          mutations: PostsMod.mutations,
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

    wrapper = mount(PostsList, { localVue, store, router });
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

  it("Renders posts when posts are present", async () => {
    const allPosts = wrapper.findAll("p.title.is-4");
    expect(allPosts).toHaveLength(wrapper.vm.totalPosts);
    expect(allPosts).toHaveLength(wrapper.vm.postsData.length);
  });

  it("Renders post title in the first card", async () => {
    await localVue.nextTick();
    const postOneComponent = wrapper.find("p.title.is-4");
    expect(postOneComponent.text()).toBe(wrapper.vm.postsData[0].title);
  });

  it("Does not render div v-else when posts are present", async () => {
    const div = wrapper.find("div.subtitle.is-5.mt-5.is-vcentered");
    expect(div.exists()).toBe(false);
  });

  it("Renders div v-else when posts are not present", async () => {
    wrapper.vm.$store.state.PostsMod.posts = 0;
    wrapper.vm.$store.state.PostsMod.totalPages = 0;
    wrapper.vm.$store.state.PostsMod.currentPage = 0;
    wrapper.vm.$store.state.PostsMod.singlePost = 0;
    wrapper.vm.$store.state.PostsMod.totalPosts = 0;
    await wrapper.vm.$nextTick();

    const div = wrapper.find("div.subtitle.is-5.mt-5.is-vcentered");
    expect(div.exists()).toBe(true);
  });

  it("Does not render pagination when posts are not present", async () => {
    wrapper.vm.$store.state.PostsMod.posts = 0;
    wrapper.vm.$store.state.PostsMod.totalPages = 0;
    wrapper.vm.$store.state.PostsMod.currentPage = 0;
    wrapper.vm.$store.state.PostsMod.singlePost = 0;
    wrapper.vm.$store.state.PostsMod.totalPosts = 0;
    await wrapper.vm.$nextTick();

    const pagination = wrapper.find("button.button.m-1.is-active");
    expect(pagination.exists()).toBe(false);
  });

  it("Renders edit and remove buttons when posts are present", async () => {
    const editButton = wrapper.find("button.button.is-warning");
    expect(editButton.exists()).toBe(true);
    const deleteButton = wrapper.find("button.button.is-danger.ml-3");
    expect(deleteButton.exists()).toBe(true);
  });

  it("Renders edit and remove buttons when authors are not present", async () => {
    wrapper.vm.$store.state.PostsMod.posts = 0;
    wrapper.vm.$store.state.PostsMod.totalPages = 0;
    wrapper.vm.$store.state.PostsMod.currentPage = 0;
    wrapper.vm.$store.state.PostsMod.singlePost = 0;
    wrapper.vm.$store.state.PostsMod.totalPosts = 0;
    await wrapper.vm.$nextTick();

    const editButton = wrapper.find("button.button.is-warning");
    expect(editButton.exists()).toBe(false);
    const deleteButton = wrapper.find("button.button.is-danger.ml-3");
    expect(deleteButton.exists()).toBe(false);
  });

  it("Should open modal", async () => {
    const openModalEditButton = wrapper.find("button.button.is-warning");
    await openModalEditButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(true);
  });
});
