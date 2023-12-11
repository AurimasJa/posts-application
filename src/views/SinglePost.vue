<template>
  <div>
    <div v-if="postData.title">
      <h1 class="title is-3 mt-2">POST PAGE</h1>
      <div class="card m-5">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ postData.title }}</p>
              <p class="subtitle is-6">
                {{ postData.author.name }}
              </p>
            </div>
          </div>
          <hr />
          <div class="content">
            <p>{{ postData.body }}</p>
          </div>
          <div class="card-footer">
            <div class="card-footer-item">
              <p
                class="subtitle is-5"
                v-if="postData.created_at <= postData.updated_at"
              >
                Updated at: {{ postData.updated_at }}
              </p>
              <p class="subtitle is-5" v-else>
                Created at: {{ postData.created_at }}
              </p>
            </div>
            <div class="card-footer-item">
              <button class="button is-warning" @click="handleEditPost">
                Edit
              </button>
              <button class="button is-danger ml-3" @click="handleRemovePost">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div>Post is unavailable. Please return to the main page.</div>
      <button class="button is-warning">
        <router-link to="/">Return to the main page</router-link>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  mounted() {
    this.getPosts({ postId: this.$route.params.id, page: 0, limit: 0 });
  },
  computed: {
    ...mapGetters("PostsMod", ["postData"]),
  },
  methods: {
    ...mapActions("PostsMod", ["getPosts"]),
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),
    handleEditPost() {
      this.SET_MODAL_VISIBILITY({
        component: "EditPost",
        modalName: "Edit post",
        props: this.postData,
      });
    },

    handleRemovePost() {
      this.postData.routeId = this.$route.params.id;
      this.SET_MODAL_VISIBILITY({
        component: "DeletePost",
        modalName: "Remove post",
        props: this.postData,
      });
    },
  },
};
</script>
