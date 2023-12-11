const state = {
  authors: [],
  totalAuthors: 0,
  authorsPaged: [],
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
  async getAuthors({ commit }) {
    try {
      const response = await this.getData(`authors`);

      commit("SET_AUTHORS", response);
    } catch (error) {}
  },

  async getAuthorsLimit({ commit, state }, page) {
    try {
      const response = await this.getData(
        `authors?_page=${page}&_limit=${LIMIT_PER_PAGE}&q=${state.searchQuery}`
      );
      commit("SET_AUTHORS_PAGED", response);

      commit("SET_TOTAL_PAGES", Math.ceil(state.totalAuthors / LIMIT_PER_PAGE));

      commit("SET_CURRENT_PAGE", page);

      await ADD_NOTIFICATION(commit, "success", "Successfully fetched authors");
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `Error getting authors: ${error.message}`
      );
    }
  },
  async postAuthor({ commit, state, dispatch }, authorData) {
    try {
      const response = await this.postData("authors", authorData);
      commit("SET_TOTAL_AUTHORS", state.totalAuthors + 1);

      commit("POST_AUTHOR", response.data);

      await dispatch("getAuthorsLimit", state.currentPage);
      await ADD_NOTIFICATION(
        commit,
        "success",
        `Author ${authorData.name} successfully created`
      );

      return response.status;
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `Error creating author: ${error.message}`
      );
    }
  },

  async deleteAuthor({ commit, dispatch }, { authorData, currentRoute }) {
    try {
      const data = await this.getData(`authors/${authorData.id}?_embed=posts`);
      for (const post of data.data.posts) {
        await dispatch(
          "PostsMod/deletePost",
          { postData: post, currentRoute: currentRoute },
          { root: true }
        );
      }
      const response = await this.deleteData("authors", authorData.id);
      if (response.status === 200) {
        commit("SET_TOTAL_AUTHORS", state.totalAuthors - 1);
        commit(
          "SET_TOTAL_PAGES",
          Math.ceil(state.totalAuthors / LIMIT_PER_PAGE)
        );
        if (state.currentPage > state.totalPages && state.currentPage != 0) {
          commit("SET_CURRENT_PAGE", state.currentPage - 1);
        }
        await dispatch("getAuthorsLimit", state.currentPage);
        commit("DELETE_AUTHOR", authorData);
        await ADD_NOTIFICATION(
          commit,
          "success",
          `Author: ${authorData.name} is removed`
        );
      } else {
        throw new Error(
          `Something went wrong while trying to remove data ${authorData.id}, ${authorData.name}`
        );
      }
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `Error removing author: ${error.message}`
      );
    }
  },

  async updateAuthor({ commit, dispatch, state }, authorData) {
    try {
      const response = await this.updateData(
        "authors",
        authorData.id,
        authorData
      );
      commit("UPDATE_AUTHOR", response.data);
      await dispatch("getAuthorsLimit", state.currentPage);
      await ADD_NOTIFICATION(
        commit,
        "success",
        `Author: ${response.data.name} is updated`
      );
      await dispatch("getAuthorsLimit", state.currentPage);
      return response.status;
    } catch (error) {
      await ADD_NOTIFICATION(
        commit,
        "danger",
        `Error updating author: ${error.message}`
      );
    }
  },
};

const mutations = {
  SET_AUTHORS(state, data) {
    state.authors = data.data;
  },
  SET_TOTAL_PAGES(state, total) {
    state.totalPages = total;
  },
  SET_CURRENT_PAGE(state, page) {
    state.currentPage = page;
  },
  SET_AUTHORS_PAGED(state, data) {
    state.authorsPaged = data.data;
    state.totalAuthors = data.total;
  },
  SET_TOTAL_AUTHORS(state, total) {
    state.totalAuthors = total;
  },
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query;
  },

  POST_AUTHOR(state, data) {
    state.authors.push(data);
    state.authorsPaged.push(data);
  },

  DELETE_AUTHOR(state, authorData) {
    const index = state.authors.findIndex(
      (author) => author.id === authorData.id
    );
    const indexPaged = state.authorsPaged.findIndex(
      (author) => author.id === authorData.id
    );
    if (index !== -1) {
      state.authors.splice(index, 1);
    }
    if (indexPaged !== -1) {
      state.authorsPaged.splice(indexPaged, 1);
    }
  },
  UPDATE_AUTHOR(state, updatedAuthor) {
    const index = state.authors.findIndex(
      (author) => author.id === updatedAuthor.id
    );
    const indexPaged = state.authorsPaged.findIndex(
      (author) => author.id === updatedAuthor.id
    );
    if (index !== -1) {
      state.authors.splice(index, 1, updatedAuthor);
    }
    if (indexPaged !== -1) {
      state.authorsPaged.splice(indexPaged, 1, updatedAuthor);
    }
  },
};

const getters = {
  authorsData(state) {
    return state.authors;
  },
  totalAuthors(state) {
    return state.totalAuthors;
  },
  authorsPaged(state) {
    return state.authorsPaged;
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
