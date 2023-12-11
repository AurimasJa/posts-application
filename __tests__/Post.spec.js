import { mount, createLocalVue } from "@vue/test-utils";
import Post from "../src/components/Posts/Post.vue";
import { describe, it } from "vitest";
import Vuex from "vuex";
import VueRouter from "vue-router";

const localVue = createLocalVue();
const router = new VueRouter();

localVue.use(Vuex);
localVue.use(VueRouter);

describe("Post.vue", () => {
  let mutations;
  let store;
  let wrapper;

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
    const post = {
      title: "Post",
      created_at: "2020-02-02",
      updated_at: "2021-02-02",
      id: 2,
      authorId: 2,
      author: {
        name: "Author updated",
        created_at: "2020-02-02",
        updated_at: "2021-02-02",
        id: 2,
      },
    };

    wrapper = mount(Post, {
      localVue,
      store,
      router,
      stubs: {
        "router-link": true,
      },
      propsData: {
        post: post,
        authorName: post.author.name,
      },
    });
  });

  it("created post display", () => {
    const title = wrapper.find("p.title.is-4");
    expect(title.text()).toBe(wrapper.vm.post.title);
    expect(wrapper.props().post).toContain({
      title: "Post",
      created_at: "2020-02-02",
      updated_at: "2021-02-02",
      id: 2,
      authorId: 2,
    });
    expect(wrapper.find("p.subtitle.is-6").exists()).toBe(true);
    expect(wrapper.find("p.subtitle.is-6").text()).toBe(wrapper.vm.authorName);

    const created = wrapper.find("p.subtitle.is-5");
    expect(
      wrapper.vm.post.created_at <= wrapper.vm.post.updated_at
        ? created.text("Updated at: 2021-02-02")
        : created.text("Created at: 2020-02-02")
    ).toBe("Updated at: 2021-02-02");

    expect(wrapper.find("button.button.is-warning").exists()).toBe(true);
    expect(wrapper.find("button.button.is-danger.ml-3").exists()).toBe(true);
  });

  it("Should call edit button twice", async () => {
    const editButton = wrapper.find("button.button.is-warning");
    await editButton.trigger("click");
    await editButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(false);
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(2);
  });

  it("Should call edit button once", async () => {
    const editButton = wrapper.find("button.button.is-danger.ml-3");
    await editButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(true);
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
  });

  it("Should call delete button once", async () => {
    const deleteButton = wrapper.find("button.button.is-danger.ml-3");
    await deleteButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$store.state.ModalMod.modalState).toBe(true);
    expect(mutations.SET_MODAL_VISIBILITY).toHaveBeenCalledTimes(1);
  });
});
