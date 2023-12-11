import Vue from "vue";
import VueRouter from "vue-router";
import Authors from "../views/Authors.vue";
import SinglePost from "../views/SinglePost.vue";
import Posts from "../views/Posts.vue";
import NotFound from "../views/NotFound.vue";
import Home from "../views/Home.vue";
import PostsList from "../components/Posts/PostsList.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
    redirect: { name: "PostsList" },
    children: [
      {
        path: "posts",
        component: Posts,
        alias: "post",
        children: [
          { path: "", component: PostsList, name: "PostsList" },
          { path: ":id", component: SinglePost, name: "SinglePost" },
        ],
      },
      {
        path: "authors/",
        component: Authors,
        name: "Authors",
      },
    ],
  },
  {
    path: "/*",
    component: NotFound,
    name: "Not Found",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
