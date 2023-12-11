<template>
  <div>
    <div class="card m-4">
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">
              <router-link :to="`/posts/${post.id}`" class="title is-4">{{
                post.title
              }}</router-link>
            </p>

            <p class="subtitle is-6">{{ authorName }}</p>
          </div>
        </div>

        <div class="card-footer">
          <div class="card-footer-item">
            <p class="subtitle is-5" v-if="post.created_at <= post.updated_at">
              Updated at: {{ post.updated_at }}
            </p>
            <p class="subtitle is-5" v-else>
              Created at: {{ post.created_at }}
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
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
  },
  methods: {
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),
    handleEditPost() {
      this.SET_MODAL_VISIBILITY({
        component: "EditPost",
        modalName: "Edit post",
        props: this.post,
      });
    },
    handleRemovePost() {
      this.SET_MODAL_VISIBILITY({
        component: "DeletePost",
        modalName: "Remove post",
        props: this.post,
      });
    },
  },
};
</script>
