import { nextTick, type Ref } from 'vue'

export const useNumericInput = (model: Ref<string | number>) => {
  const checkIfNumber = (e: KeyboardEvent) => {
    const key = e.key
    if (key >= '0' && key <= '9') {
      return
    }
    if (key === '.' || key === ',') {
      const input = model.value.toString()
      if (!input.includes('.')) {
        if (key === ',') {
          e.preventDefault()
          const el = e.target as HTMLInputElement
          const start = el.selectionStart ?? input.length
          model.value = input.slice(0, start) + '.' + input.slice(start)
          nextTick(() => el.setSelectionRange(start + 1, start + 1))
        }
        return
      }
    }
    e.preventDefault()
  }

  const onPaste = (e: ClipboardEvent) => {
    const pasted = e.clipboardData?.getData('text') ?? ''
    if (/[,]/.test(pasted)) {
      e.preventDefault()
      const normalized = pasted.replace(/,/g, '.')
      const el = e.target as HTMLInputElement
      const start = el.selectionStart ?? 0
      const end = el.selectionEnd ?? 0
      const current = model.value.toString()
      model.value = current.slice(0, start) + normalized + current.slice(end)
    }
  }

  return { checkIfNumber, onPaste }
}
