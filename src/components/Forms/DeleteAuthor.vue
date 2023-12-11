<template>
  <div>
    <p>Are you sure you want to <b>remove</b> {{ authorName }}?</p>
    <div class="flex is-justify-content-between mt-4 is-spaced">
      <button class="button is-danger" @click="handleDeleteAuthor">
        Remove
      </button>
      <button class="button is-warning ml-5" @click="changeState">
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters("ModalMod", ["modalName", "currentProps"]),
  },

  methods: {
    ...mapActions("AuthorsMod", ["deleteAuthor"]),
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),

    changeState() {
      this.SET_MODAL_VISIBILITY({
        component: null,
        modalName: null,
      });
    },

    async handleDeleteAuthor() {
      const authorData = this.deleteAuthorData();
      this.deleteAuthor({
        authorData: authorData,
        currentRoute: this.$router.currentRoute.fullPath,
      });

      this.changeState();
    },

    deleteAuthorData() {
      const authorData = {
        id: this.currentProps.id,
        name: this.currentProps.name,
        created_at: this.currentProps.created_at,
        updated_at: this.currentProps.updated_at,
      };
      return authorData;
    },
  },

  watch: {
    currentProps: {
      immediate: true,
      handler: function (author) {
        this.authorName = author.name;
      },
    },
  },
};
</script>
