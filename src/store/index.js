import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import uuid from 'uuid/v4'

Vue.use(Vuex)

const state = {
  columns: [],
  labels: []
}

const getters = {
  allCards: (state) => {
    return state.columns.reduce((cards, column) => cards.concat(column.cards), [])
  },
  findCardByUuid: (state, getters) => (uuid) => {
    return getters.allCards.find(card => card.uuid === uuid)
  },
  findLabelByUuid: (state) => (uuid) => {
    return state.labels.find(label => label.uuid === uuid)
  }
}

const actions = {
  updateCardTitle({ getters, commit }, { uuid, title }) {
    commit('updateCardTitle', { card: getters.findCardByUuid(uuid), title })
  },
  updateCardColor({ getters, commit }, { uuid, color }) {
    commit('updateCardColor', { card: getters.findCardByUuid(uuid), color })
  },
  updateCardLabels({ getters, commit }, { uuid, labels }) {
    commit('updateCardLabels', { card: getters.findCardByUuid(uuid), labels })
  },
  updateLabel({ getters, commit }, { uuid, name }) {
    commit('updateLabel', { label: getters.findLabelByUuid(uuid), name })
  }
}

const mutations = {
  addColumn(state, { title }) {
    const column = { uuid: uuid(), title, cards: [] }
    state.columns.push(column)
  },
  removeColumn(state, { column }) {
    const index = state.columns.indexOf(column)

    if (index > -1) {
      state.columns.splice(index, 1)
    }
  },
  updateColumns(state, columns) {
    state.columns = columns
  },
  addCard(state, { column, title }) {
    const card = { uuid: uuid(), title, color: 'none', labels: [] };
    state.columns.find(element => element.uuid === column.uuid).cards.push(card)
  },
  updateCards(state, { column, cards }) {
    state.columns.find(element => element.uuid === column.uuid).cards = cards
  },
  updateCardTitle(state, { card, title }) {
    card.title = title
  },
  updateCardColor(state, { card, color }) {
    card.color = color
  },
  updateCardLabels(state, { card, labels }) {
    card.labels = labels
  },
  addLabel(state, { name }) {
    state.labels.push({ uuid: uuid(), name, color: null })
  },
  updateLabel(state, { label, name }) {
    label.name = name
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  plugins: [createPersistedState({ key: 'board' })]
})
