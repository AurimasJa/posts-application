<template>
  <div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <label class="label">Title</label>
          <div class="control">
            <input class="input" type="text" id="title" v-model="title" />
          </div>
        </div>
        <div class="field">
          <label class="label">Body</label>
          <div class="control">
            <textarea
              class="textarea"
              type="text"
              id="body"
              v-model="body"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="card-footer is-justify-content-center">
      <div class="flex is-justify-content-between mt-4 is-spaced">
        <button class="button is-success" @click="editPost">
          Save changes
        </button>
        <button class="button is-danger ml-5" @click="changeState">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      postData: {},
      title: "",
      body: "",
    };
  },

  computed: {
    ...mapGetters("ModalMod", ["modalName", "currentProps"]),
  },

  methods: {
    ...mapActions("PostsMod", ["updatePost"]),
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),
    ...mapMutations("NotificationsMod", ["ADD_NOTIFICATION"]),

    changeState() {
      this.SET_MODAL_VISIBILITY({
        component: null,
        modalName: null,
      });
    },

    async editPost() {
      if (this.validation()) {
        const data = this.updatePostData();
        if (
          data.title != this.currentProps.title ||
          data.body != this.currentProps.body
        ) {
          let status = await this.updatePost(data);
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

    updatePostData() {
      const date = new Date();
      let updated = date.toISOString().split("T")[0];
      const postData = {
        id: this.currentProps.id,
        title: this.title,
        body: this.body,
        updated_at: updated,
        created_at: this.currentProps.created_at,
        authorId: this.currentProps.authorId,
        author: this.currentProps.author,
      };
      return postData;
    },

    validation() {
      this.errors = {};

      if (this.title == "" || this.title == undefined || !this.title.trim()) {
        this.errors.name = "Title must not be empty";
      } else if (
        this.title.trim().length > 50 ||
        this.title.trim().length < 3
      ) {
        this.errors.name =
          "The title must be longer than 3 symbols and can not exceed more than 50 symbols";
      } else if (
        this.body.trim().length > 500 ||
        this.body.trim().length < 10
      ) {
        this.errors.name =
          "The content must be longer than 10 symbols and can not exceed more than 500 symbols";
      }

      return Object.keys(this.errors).length === 0;
    },
  },

  watch: {
    currentProps: {
      immediate: true,
      handler: function (post) {
        this.title = post.title;
        this.body = post.body;
      },
    },
  },
};
</script>
