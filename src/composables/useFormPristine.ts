import { ref, watch, type Ref } from 'vue'

type FormValue = string | number | null | undefined

export function useFormPristine(watchedRefs: readonly Ref<FormValue>[]) {
  const isPristine = ref(true)

  const reset = () => {
    isPristine.value = true
  }

  const markDirty = () => {
    isPristine.value = false
  }

  watch(
    () => watchedRefs.map(source => source.value),
    (newValues, oldValues) => {
      if (
        newValues.some(
          (value, index) => value !== '' && oldValues[index] === '',
        )
      ) {
        markDirty()
      }
    },
  )

  return { isPristine, reset, markDirty }
}
