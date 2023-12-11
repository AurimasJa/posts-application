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
          <label class="label">Author</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectedAuthor">
                <option
                  v-for="(author, index) in authorsData"
                  :key="author.id"
                  :value="author"
                >
                  {{ index + 1 }}. {{ author.name }}
                </option>
              </select>
            </div>
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
        <button class="button is-success" @click="createPost">
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
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      title: "",
      body: "",
      selectedAuthor: {},
      errors: {},
    };
  },
  mounted() {
    this.getAuthors();
  },
  computed: {
    ...mapGetters("AuthorsMod", ["authorsData"]),
    ...mapGetters("ModalMod", ["currentProps"]),
  },
  methods: {
    ...mapActions("PostsMod", ["postPost"]),
    ...mapMutations("ModalMod", ["SET_MODAL_VISIBILITY"]),
    ...mapMutations("NotificationsMod", ["ADD_NOTIFICATION"]),
    ...mapActions("AuthorsMod", ["getAuthors"]),

    changeState() {
      this.SET_MODAL_VISIBILITY({
        component: null,
        modalName: null,
      });
    },

    async createPost() {
      if (this.validation()) {
        const postData = this.createPostData();
        let status = await this.postPost(postData);
        if (status == 201) {
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

    createPostData() {
      let date = new Date();
      let created = date.toISOString().split("T")[0];
      const postData = {
        title: this.title,
        body: this.body,
        authorId: this.selectedAuthor.id,
        created_at: created,
        updated_at: "0001-01-01",
        author: this.selectedAuthor,
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
      } else if (!this.selectedAuthor || !this.selectedAuthor.id) {
        this.errors.name = "You must choose an author";
      }

      return Object.keys(this.errors).length === 0;
    },
  },
};
</script>
