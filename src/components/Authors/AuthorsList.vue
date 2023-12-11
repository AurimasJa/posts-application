<template>
  <div>
    <button class="button is-success" @click="createAuthorButton">
      Create author
    </button>

    <Search @query="search" />

    <div :class="customLayout" v-if="authorsPaged && authorsPaged.length > 0">
      <Author
        :class="customDisplay"
        v-for="author in authorsPaged"
        :key="author.id"
        :author="author"
      />
    </div>
    <div v-else class="subtitle is-5 mt-5 is-vcentered">
      There are no authors to display.
    </div>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @changepage="changePage"
    />
  </div>
</template>

<script>
import Author from "./Author.vue";
import Pagination from "../Pagination.vue";
import Search from "../Search.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  props: {
    customLayout: {
      type: String,
      default: "",
    },
    customDisplay: {
      type: String,
      default: "",
    },
  },

  components: {
    Author,
    Pagination,
    Search,
  },

  computed: {
    ...mapGetters("AuthorsMod", [
      "authorsData",
      "totalAuthors",
      "authorsPaged",
      "currentPage",
      "totalPages",
      "searchQuery",
    ]),
  },

  methods: {
    ...mapActions("AuthorsMod", ["getAuthors", "getAuthorsLimit"]),
    ...mapMutations("AuthorsMod", ["SET_SEARCH_QUERY", "SET_CURRENT_PAGE"]),
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),

    async changePage(nextPage) {
      await this.getAuthorsLimit(nextPage);
    },

    async search(query) {
      this.SET_SEARCH_QUERY(query);
      this.SET_CURRENT_PAGE(1);
      await this.changePage(this.currentPage);
    },

    createAuthorButton() {
      this.SET_MODAL_VISIBILITY({
        component: "CreateAuthor",
        modalName: "Create author",
      });
    },
  },

  mounted() {
    this.getAuthors();
    this.getAuthorsLimit(this.currentPage);
  },
};
</script>
