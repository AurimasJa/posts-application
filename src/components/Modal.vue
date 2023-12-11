<template>
  <div>
    <div class="modal" :class="{ 'is-active': modalState }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head is-justify-content-end">
          <p class="modal-card-title">{{ modalName }}</p>
          <button
            class="delete"
            aria-label="close"
            @click="changeState"
          ></button>
        </header>
        <section class="modal-card-body">
          <component :is="currentComponent" v-if="currentComponent" />
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

import CreatePost from "../components/Forms/CreatePost.vue";
import CreateAuthor from "../components/Forms/CreateAuthor.vue";
import EditAuthor from "../components/Forms/EditAuthor.vue";
import EditPost from "../components/Forms/EditPost.vue";
import DeleteAuthor from "../components/Forms/DeleteAuthor.vue";
import DeletePost from "../components/Forms/DeletePost.vue";

export default {
  components: {
    CreatePost,
    CreateAuthor,
    EditAuthor,
    EditPost,
    DeleteAuthor,
    DeletePost,
  },
  computed: {
    ...mapGetters("ModalMod", ["modalState", "currentComponent", "modalName"]),
  },
  methods: {
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),

    changeState() {
      this.SET_MODAL_VISIBILITY({
        component: null,
        modalName: null,
      });
    },
  },
};
</script>

<style></style>
