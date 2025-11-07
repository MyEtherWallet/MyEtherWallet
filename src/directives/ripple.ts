const ripple = (event: Event) => {
  const el = event.currentTarget as HTMLElement
  el.style.position = 'relative'
  el.style.overflow = 'hidden' // Add this line

  const rippleEl = document.createElement('span')
  const rect = el.getBoundingClientRect()
  //TODO add TOUCH EVENT HANDLER
  const x = (event as MouseEvent).clientX - rect.left
  const y = (event as MouseEvent).clientY - rect.top

  const radius = Math.max(el.offsetWidth, el.offsetHeight) / 2

  rippleEl.style.left = `${x - radius}px`
  rippleEl.style.top = `${y - radius}px`

  rippleEl.style.width = `${radius * 2}px`
  rippleEl.style.height = `${radius * 2}px`

  rippleEl.classList.add('ripple')

  el.appendChild(rippleEl)

  setTimeout(() => {
    rippleEl.remove()
  }, 600)
}

const addEventListeners = (el: HTMLElement) => {
  el.addEventListener('click', ripple)
  el.addEventListener('touchstart', ripple, { passive: true })
  el.addEventListener('keydown', ripple)
}

const removeListeners = (el: HTMLElement) => {
  el.removeEventListener('click', ripple)
  el.removeEventListener('touchstart', ripple)
  el.removeEventListener('keydown', ripple)
}

const mounted = (el: HTMLElement) => {
  addEventListeners(el)
}

const unmounted = (el: HTMLElement) => {
  removeListeners(el)
}

export const Ripple = {
  mounted,
  unmounted,
}

export default Ripple
