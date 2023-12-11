<template>
  <div>
    <h1 class="title is-3 mt-2">POSTS PAGE</h1>

    <div class="block">
      <a class="button is-success" @click="createPostButton">Create post</a>
    </div>

    <Search @query="search" />
    <div v-if="postsData.length > 0">
      <Post
        v-for="post in postsData"
        :key="post.id"
        :post="post"
        :authorName="post.author.name"
      />
    </div>

    <div v-else class="subtitle is-5 mt-5 is-vcentered">
      There are no posts to display.
    </div>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changepage="changePage"
    />
  </div>
</template>

<script>
import Post from "./Post.vue";
import Pagination from "../Pagination.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import Search from "../Search.vue";
export default {
  components: {
    Post,
    Pagination,
    Search,
  },
  computed: {
    ...mapGetters("PostsMod", [
      "postsData",
      "totalPosts",
      "currentPage",
      "totalPages",
      "searchQuery",
    ]),
  },
  methods: {
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),
    ...mapActions("PostsMod", ["getPosts"]),
    ...mapMutations("PostsMod", ["SET_CURRENT_PAGE", "SET_SEARCH_QUERY"]),
    createPostButton() {
      this.SET_MODAL_VISIBILITY({
        component: "CreatePost",
        modalName: "Create post",
      });
    },

    async changePage(nextPage) {
      await this.getPosts({
        postId: null,
        page: nextPage,
      });
    },

    async search(query) {
      this.SET_SEARCH_QUERY(query);
      this.SET_CURRENT_PAGE(1);
      await this.changePage(this.currentPage);
    },
  },

  mounted() {
    this.getPosts({ postId: null, page: this.currentPage });
  },
};
</script>
