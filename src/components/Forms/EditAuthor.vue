<template>
  <div>
    <label class="mr-4" for="authorName">Name</label>
    <input type="text" id="authorName" v-model="authorName" />
    <div class="flex is-justify-content-between mt-4 is-spaced">
      <button class="button is-success" @click="updateAuthorButton">
        Save changes
      </button>
      <button class="button is-danger ml-5" @click="changeState">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      errors: {},
      authorData: {},
      authorName: "",
    };
  },

  computed: {
    ...mapGetters("ModalMod", ["modalName", "currentProps"]),
  },

  methods: {
    ...mapActions("AuthorsMod", ["updateAuthor"]),
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),
    ...mapMutations("NotificationsMod", ["ADD_NOTIFICATION"]),

    changeState() {
      this.SET_MODAL_VISIBILITY({
        component: null,
        modalName: null,
      });
    },

    async updateAuthorButton() {
      if (this.validation()) {
        const authorData = this.updateAuthorData();
        if (this.currentProps.name != this.authorName) {
          let status = await this.updateAuthor(authorData);
          if (status == 200) {
            this.changeState();
          }
        } else {
          this.changeState();
        }
      } else {
        for (const key in this.errors) {
          if (Object.hasOwnProperty.call(this.errors, key)) {
            const errorMessage = this.errors[key];
            this.ADD_NOTIFICATION({
              type: "danger",
              message: errorMessage,
            });
          }
        }
      }
    },

    updateAuthorData() {
      let date = new Date();
      let updated = date.toISOString().split("T")[0];
      const authorData = {
        id: this.currentProps.id,
        name: this.authorName,
        created_at: this.currentProps.created_at,
        updated_at: updated,
      };
      return authorData;
    },

    validation() {
      this.errors = {};
      const lettersAndSpaces = /^[A-Za-z -]+$/;
      const oneLetterMust = /[A-Za-z]/;

      if (
        this.authorName == "" ||
        this.authorName == undefined ||
        !this.authorName.trim() ||
        !oneLetterMust.test(this.authorName)
      ) {
        this.errors.name = "Name must contain at least one letter";
      } else if (!lettersAndSpaces.test(this.authorName)) {
        this.errors.name = "Name cannot contain numbers";
      } else if (this.authorName.length > 30) {
        this.errors.name =
          "Name is too long, it can't be longer than 30 symbols";
      }

      return Object.keys(this.errors).length === 0;
    },
  },

  watch: {
    currentProps: {
      immediate: true,
      handler: function (author) {
        if (author && author.name) {
          this.authorName = author.name;
        }
      },
    },
  },
};
</script>
