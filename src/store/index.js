import Vue from "vue";
import Vuex from "vuex";
import NotificationsMod from "./modules/NotificationsMod";

import AuthorsMod from "./modules/AuthorsMod";
import ModalMod from "./modules/ModalMod";
import PostsMod from "./modules/PostsMod.js";
import { apiPlugin } from "./plugins/apiPlugin.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    NotificationsMod,
    ModalMod,
    AuthorsMod,
    PostsMod,
  },
  plugins: [apiPlugin],
});
