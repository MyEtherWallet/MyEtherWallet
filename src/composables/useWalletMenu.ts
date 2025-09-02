import { ref } from 'vue'

export const useWalletMenu = () => {
  const isOpenSideMenu = ref(false)

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
  }
}
