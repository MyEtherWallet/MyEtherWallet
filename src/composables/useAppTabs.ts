import { computed, nextTick, onBeforeMount, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { type Tab, type Tab_Panel } from '@/types/components/appTabs'

export const useAppTabs = (
  activeTabIndex: Ref<number>,
  panels: Tab_Panel[],
  tabs: Tab[],
  useRouteLink: boolean = false,
) => {
  const router = useRouter()
  const route = useRoute()
  const currentRouteName = computed(() => route.name)

  /**
   * Computed property to get the currently active panel based on the active tab index.
   */
  const currActivePanel = computed(() => {
    return panels[activeTabIndex.value]
  })

  /**
   *
   * @param index - The index of the tab to navigate to.
   * Navigates to the specified tab's route if `useRouteLink` is true,
   * and focuses on the corresponding tab element.
   * If an error occurs during navigation, it logs the error to the console.
   */
  const navigateToTab = async (index: number) => {
    try {
      if (useRouteLink) {
        await nextTick()
        await router.push({ name: tabs[index].routeName })
      }
      await nextTick()
      document.getElementById(tabs[index].id)?.focus()
    } catch (err) {
      //Todo: add sentry logging
      console.error('Failed to navigate to tab:', err)
    }
  }

  /**
   * Handles keyboard navigation for tab switching.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered by user interaction.
   *
   * If the left arrow key is pressed:
   * - Decrements the activeTabIndex value if it's greater than 0.
   * - If `useRouteLink` prop is true, navigates to the previous tab's route and focuses on its element.
   *
   * If the right arrow key is pressed:
   * - Increments the activeTabIndex value if it's less than the total number of tabs minus one.
   * - If `useRouteLink` prop is true, navigates to the next tab's route and focuses on its element.
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    let next = 0
    if (event.key === 'ArrowLeft') {
      if (activeTabIndex.value === 0) {
        return
      }
      next = activeTabIndex.value - 1
    } else if (event.key === 'ArrowRight') {
      if (activeTabIndex.value === tabs.length - 1) return
      next = activeTabIndex.value + 1
    }
    activeTabIndex.value = next
    navigateToTab(next)
  }

  /**
   * Ensure corret active tab is set if using routerlink
   */
  onBeforeMount(() => {
    if (useRouteLink) {
      const index = tabs.findIndex(
        tab => tab.routeName === currentRouteName.value,
      )
      if (index !== -1) {
        activeTabIndex.value = index
      } else {
        activeTabIndex.value = 0
        navigateToTab(0)
      }
    }
  })

  return {
    activeTabIndex,
    currActivePanel,
    navigateToTab,
    handleKeyDown,
    currentRouteName,
  }
}
