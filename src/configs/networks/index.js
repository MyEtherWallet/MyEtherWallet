import * as types from './types'
import * as nodes from './nodes'

let nodeList = {}

Object.keys(types).forEach((key) => {
  nodeList[key] = []
})

Object.keys(nodes).forEach((key) => {
  nodeList[nodes[key].type.name].push(nodes[key])
})

export default nodeList
