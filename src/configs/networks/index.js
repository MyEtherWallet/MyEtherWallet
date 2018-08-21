import * as types from './types'
import * as nodes from './nodes'

let nodeList = {}

Object.keys(types).forEach((key) => {
  nodeList[key] = []
})

Object.keys(nodes).forEach((key) => {
  if (nodes[key].service === 'myetherwallet.com') {
    nodeList[nodes[key].type.name].splice(0, 0, nodes[key])
  } else {
    nodeList[nodes[key].type.name].push(nodes[key])
  }
})

export default nodeList
