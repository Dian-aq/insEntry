let store = {
  state: {
    editMode: false,
    item: ''
  },
  setEditModeAction (newValue) {
    this.state.editMode = newValue
  },
  setItemAction (newValue) {
    this.state.item = newValue
  },
  clearItemAction () {
    this.state.item = ''
  }
}
export default store
