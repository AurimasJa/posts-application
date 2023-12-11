<template>
  <div v-if="totalPages > 1">
    <button class="button m-1" @click="prevPage" :disabled="currentPage === 1">
      Previous
    </button>

    <button
      class="button m-1"
      @click="firstPage"
      v-bind:class="currentPage === 1 ? `is-active` : ``"
      :disabled="currentPage === 1"
    >
      1
    </button>

    <button
      class="button m-1 is-active"
      v-if="currentPage != 1 && currentPage != totalPages"
    >
      {{ currentPage }}
    </button>

    <input
      class="button m-1 maximum"
      type="number"
      v-model="whichPage"
      :max="totalPages"
      :min="1"
    />

    <button
      class="button m-1"
      @click="customPage"
      :disabled="currentPage === parseInt(whichPage)"
    >
      Go
    </button>

    <button
      class="button m-1"
      @click="lastPage"
      v-bind:class="currentPage === totalPages ? `is-active` : ``"
      :disabled="currentPage === totalPages"
    >
      {{ totalPages }}
    </button>

    <button
      class="button m-1"
      @click="nextPage"
      :disabled="currentPage === totalPages"
    >
      Next
    </button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  props: {
    currentPage: { type: Number },
    totalPages: { type: Number },
  },
  data() {
    return {
      whichPage: [],
    };
  },
  methods: {
    ...mapMutations("NotificationsMod", ["ADD_NOTIFICATION"]),
    firstPage() {
      this.$emit("changepage", 1);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.$emit("changepage", this.currentPage - 1);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$emit("changepage", this.currentPage + 1);
      }
    },
    lastPage() {
      this.$emit("changepage", this.totalPages);
    },
    customPage() {
      const pageNumber = parseInt(this.whichPage);
      if (
        !isNaN(pageNumber) &&
        pageNumber >= 1 &&
        pageNumber <= this.totalPages
      ) {
        this.$emit("changepage", pageNumber);
      } else {
        this.ADD_NOTIFICATION({
          type: "danger",
          message: `There is no such page, you can choose between: 1 and ${this.totalPages}`,
        });
      }
    },
  },
};
</script>

<style>
.maximum {
  max-width: 100px;
}
</style>
