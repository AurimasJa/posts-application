<template>
  <div>
    <label class="label subtitle is-4 m-3">Search</label>
    <div class="field has-addons is-justify-content-center">
      <div class="control">
        <input
          class="input is-rounded"
          type="text"
          placeholder="Search here"
          v-model="searchQuery"
        />
      </div>
    </div>
    <hr />
  </div>
</template>

<script>
import _debounce from "lodash/debounce";

export default {
  data() {
    return {
      searchQuery: "",
    };
  },
  methods: {
    query: _debounce(function () {
      this.$emit("query", this.searchQuery);
    }, 1000),
  },
  watch: {
    searchQuery: "query",
  },
};
</script>

<style>
.cursor-text {
  cursor: text;
}
</style>
