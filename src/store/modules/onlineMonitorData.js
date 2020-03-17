let store = {
  state: {
    model: []
  },
  saveLocalFactor (_obj) {
    let arr = this.state.model
    let existModelId = arr.findIndex(item => item.modelId === _obj.modelId) // 数组中是否已存在modelId，-1表示已存在
    if (existModelId !== -1) {
      arr.splice(existModelId, 1)
      arr.filter(obj => obj.modelId !== _obj.modelId)
    }
    arr.push(_obj)
    this.state.model = arr
  }
}
export default store
