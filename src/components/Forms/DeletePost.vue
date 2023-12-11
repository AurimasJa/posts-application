<template>
  <div>
    <p>Are you sure you want to <b>remove</b> {{ title }}?</p>
    <div class="flex is-justify-content-between mt-4 is-spaced">
      <button class="button is-danger" @click="handleDeletePost">Remove</button>
      <button class="button is-warning ml-5" @click="changeState">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("ModalMod", ["modalName", "currentProps"]),
  },
  methods: {
    ...mapActions("PostsMod", ["deletePost"]),
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),

    changeState() {
      this.SET_MODAL_VISIBILITY({
        component: null,
        modalName: null,
      });
    },

    async handleDeletePost() {
      let route;
      const postData = this.deletePostData();
      if (postData.routeId !== undefined) {
        route = postData.routeId;
        delete postData.routeId;
      }
      this.deletePost({
        postData: postData,
        currentRoute: this.$router.currentRoute.fullPath,
      });
      this.changeState();
      if (route !== undefined) {
        this.$router.push(`/`);
      }
    },

    deletePostData() {
      const postData = {
        id: this.currentProps.id,
        title: this.currentProps.title,
        body: this.currentProps.body,
        authorId: this.currentProps.authorId,
        created_at: this.currentProps.created_at,
        updated_at: this.currentProps.updated_at,
        author: this.currentProps.author,
        routeId: this.currentProps.routeId,
      };
      return postData;
    },
  },

  watch: {
    currentProps: {
      immediate: true,
      handler: function (post) {
        this.title = post.title;
      },
    },
  },
};
</script>
