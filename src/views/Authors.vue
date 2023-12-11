<template>
  <div class="has-text-centered">
    <h1 class="title is-3 mt-2">AUTHORS PAGE</h1>

    <AuthorsList
      customLayout="columns is-multiline is-justify-content-center"
      customDisplay="m-4 column is-3"
    />
  </div>
</template>

<script>
import AuthorsList from "../components/Authors/AuthorsList.vue";
import CreateAuthor from "../components/Forms/CreateAuthor.vue";
export default {
  components: {
    AuthorsList,
    CreateAuthor,
  },
};
</script>

<style>
.center-table {
  margin: 0 auto;
}
</style>
