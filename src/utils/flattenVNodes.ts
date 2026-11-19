import { Comment, Fragment, Text, type VNode } from 'vue'

/**
 * The elements a slot actually rendered: unwraps fragments (`v-for`,
 * `<template>`) and drops comments (a false `v-if`) and whitespace-only text,
 * so a component can wrap or interleave each child.
 */
export const flattenVNodes = (nodes: VNode[] = []): VNode[] =>
  nodes.flatMap(node => {
    if (node.type === Fragment) return flattenVNodes(node.children as VNode[])
    if (node.type === Comment) return []
    if (node.type === Text && !String(node.children).trim()) return []
    return [node]
  })
