const state = {
  posts: [],
  singlePost: [],
  totalPosts: 0,
  currentPage: 1,
  totalPages: 0,
  searchQuery: "",
};

async function ADD_NOTIFICATION(commit, type, message) {
  commit(
    "NotificationsMod/ADD_NOTIFICATION",
    {
      type: type,
      message: message,
    },
    { root: true }
  );
}

const actions = {
  async getPosts({ commit, state }, { postId, page }) {
    try {
      postId = postId ?? "";
      if (!postId || postId == null || postId == undefined || postId == "") {
        const response = await this.getData(
          `posts?_expand=author&_page=${page}&_limit=${LIMIT_PER_PAGE}&q=${state.searchQuery}`
        );
        commit("SET_POSTS", response);
        commit("SET_CURRENT_PAGE", page);
        commit("SET_TOTAL_PAGES", Math.ceil(state.totalPosts / LIMIT_PER_PAGE));
        await ADD_NOTIFICATION(commit, "success", "Successfully fetched posts");
      } else {
        const response = await this.getData(`posts/${postId}?_expand=author`);
        commit("SET_POST", response.data);
        await ADD_NOTIFICATION(commit, "success", "Successfully fetched post");
      }
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `Error getting posts: ${error.message}`
      );
    }
  },
  async postPost({ commit, state, dispatch }, postData) {
    try {
      const createPostData = {
        title: postData.title,
        body: postData.body,
        authorId: postData.authorId,
        created_at: postData.created_at,
        updated_at: postData.created_at,
      };
      const response = await this.postData("posts", createPostData);
      commit("SET_TOTAL_POSTS", state.totalPosts + 1);

      postData.id = response.data.id;
      commit("POST_POST", postData);

      await dispatch("getPosts", {
        postId: "",
        page: state.currentPage,
      });
      await ADD_NOTIFICATION(
        commit,
        "success",
        "Post was successfully created"
      );
      return await response.status;
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `Error creating a post: ${error.message}`
      );
    }
  },

  async updatePost({ commit, dispatch, state }, postData) {
    try {
      const updatePostData = {
        id: postData.id,
        title: postData.title,
        body: postData.body,
        authorId: postData.authorId,
        created_at: postData.created_at,
        updated_at: postData.updated_at,
      };
      const response = await this.updateData(
        `posts`,
        updatePostData.id,
        updatePostData
      );
      commit("UPDATE_POST", postData);
      await dispatch("getPosts", {
        postId: "",
        page: state.currentPage,
      });
      await ADD_NOTIFICATION(
        commit,
        "success",
        `Post ${postData.title} updated successfully`
      );
      return response.status;
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `An error occured during an update: ${error.message}`
      );
    }
  },

  async deletePost({ commit, state, dispatch }, { postData, currentRoute }) {
    try {
      const response = await this.deleteData("posts", postData.id);
      if (response.status === 200) {
        const postsRouteRegex = /^\/posts(?:\/.*)?$/;
        const postRouteRegex = /^\/post(?:\/.*)?$/;
        if (
          postsRouteRegex.test(currentRoute) ||
          postRouteRegex.test(currentRoute)
        ) {
          commit("SET_TOTAL_POSTS", state.totalPosts - 1);
          commit("DELETE_POST", postData);
          commit(
            "SET_TOTAL_PAGES",
            Math.ceil(state.totalPosts / LIMIT_PER_PAGE)
          );

          if (state.currentPage > state.totalPages && state.currentPage != 0) {
            commit("SET_CURRENT_PAGE", state.currentPage - 1);
          }
          await dispatch("getPosts", {
            postId: "",
            page: state.currentPage,
          });
        }

        await ADD_NOTIFICATION(
          commit,
          "success",
          `Post: ${postData.title} is removed`
        );
      } else {
        throw new Error(
          `Something went wrong while trying to remove data ${postData.id}, ${postData.title}`
        );
      }
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `Error removing a post: ${error.message}`
      );
    }
  },
};

const mutations = {
  SET_TOTAL_PAGES(state, total) {
    state.totalPages = total;
  },
  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page;
  },
  SET_POSTS(state, data) {
    state.posts = data.data;
    state.totalPosts = data.total;
  },
  SET_POST(state, data) {
    state.singlePost = data;
  },
  SET_TOTAL_POSTS(state, total) {
    state.totalPosts = total;
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query;
  },

  POST_POST(state, data) {
    state.posts.push(data);
  },
  UPDATE_POST(state, data) {
    const index = state.posts.findIndex((post) => post.id === data.id);

    if (index !== -1) {
      state.posts.splice(index, 1, data);
    }

    state.singlePost = data;
  },
  DELETE_POST(state, data) {
    const index = state.posts.findIndex((post) => post.id === data.id);

    if (index !== -1) {
      state.posts.splice(index, 1);
    }

    state.singlePost = data;
  },
};

const getters = {
  postsData(state) {
    return state.posts;
  },
  totalPosts(state) {
    return state.totalPosts;
  },
  postData(state) {
    return state.singlePost;
  },
  currentPage(state) {
    return state.currentPage;
  },
  totalPages(state) {
    return state.totalPages;
  },
  searchQuery(state) {
    return state.searchQuery;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
