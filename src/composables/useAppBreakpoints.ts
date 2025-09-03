import { useBreakpoints } from '@vueuse/core'
import { computed } from 'vue'
export const useAppBreakpoints = () => {
  /** MUST MATCH TAILWIND CONFIGS */
  const breakpoints = useBreakpoints({
    xs: 576,
    sm: 768,
    md: 820,
    'md-header': 940,
    lg: 1024,
    'lg-max': 1084,
    'xl-min': 1140,
    xl: 1280,
    '2xl': 1440,
    '3xl': 1601,
  })
  const isXS = computed<boolean>(() => breakpoints.smaller('xs').value)
  const isMobile = computed<boolean>(() => breakpoints.smaller('sm').value)
  const isTablet = computed<boolean>(
    () =>
      breakpoints.greaterOrEqual('sm').value && breakpoints.smaller('lg').value,
  )
  const isXsAndUp = computed<boolean>(
    () => breakpoints.greaterOrEqual('xs').value,
  )
  const isMDAndUp = computed<boolean>(
    () => breakpoints.greaterOrEqual('md').value,
  )
  const isHeaderMaxAndUp = computed<boolean>(
    () => breakpoints.greaterOrEqual('md-header').value,
  )
  const isDesktopAndUp = computed<boolean>(
    () => breakpoints.greaterOrEqual('lg').value,
  )
  const isDesktopMaxAndUp = computed<boolean>(
    () => breakpoints.greaterOrEqual('lg-max').value,
  )
  const isXLMinAndUp = computed<boolean>(
    () => breakpoints.greaterOrEqual('xl-min').value,
  )

  return {
    breakpoints,
    isMobile,
    isTablet,
    isXS,
    isDesktopAndUp,
    isMDAndUp,
    isDesktopMaxAndUp,
    isHeaderMaxAndUp,
    isXLMinAndUp,
    isXsAndUp,
  }
}
