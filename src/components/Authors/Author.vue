<template>
  <div>
    <div v-if="author && author.name">
      <div class="card">
        <div class="card-content max-height">
          <div class="media">
            <div class="media-content">
              <p class="title is-6">
                Name:
                <span class="title is-6">{{ author.name }}</span>
              </p>
              <p
                class="subtitle is-7"
                v-if="author.created_at <= author.updated_at"
              >
                Updated at: {{ author.updated_at }}
              </p>
              <p class="subtitle is-7" v-else>
                Created at: {{ author.created_at }}
              </p>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="card-footer-item">
            <button class="button is-warning" @click="handleEditAuthor">
              Edit
            </button>
          </div>
          <div class="card-footer-item">
            <button class="button is-danger ml-3" @click="handleDeleteAuthor">
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
    author: {
      type: Object,
      required: true,
    },
  },

  methods: {
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),
    handleEditAuthor() {
      this.SET_MODAL_VISIBILITY({
        component: "EditAuthor",
        modalName: "Edit author",
        props: this.author,
      });
    },
    handleDeleteAuthor() {
      this.SET_MODAL_VISIBILITY({
        component: "DeleteAuthor",
        modalName: "Remove author",
        props: this.author,
      });
    },
  },
};
</script>

<style>
.max-height {
  max-height: 110px;
  min-height: 110px;
}
</style>
