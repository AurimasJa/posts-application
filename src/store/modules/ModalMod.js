const state = {
  modalState: false,
  modalName: null,
  currentComponent: null,
  currentProps: {},
};

const mutations = {
  SET_MODAL_VISIBILITY: (state, { component, modalName, props }) => {
    state.modalState = !state.modalState;
    state.modalName = modalName || null;
    state.currentComponent = component || null;
    state.currentProps = props || {};
  },
};

const getters = {
  modalState(state) {
    return state.modalState;
  },
  currentComponent(state) {
    return state.currentComponent;
  },
  modalName(state) {
    return state.modalName;
  },
  currentProps(state) {
    return state.currentProps;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
