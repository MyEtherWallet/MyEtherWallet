import { ref } from 'vue'

export const useWalletMenu = () => {
  const isOpenSideMenu = ref(false)
  const walletPanel = ref(0)

  const setIsOpenSideMenu = (value: boolean) => {
    isOpenSideMenu.value = value
  }

  const setWalletPanel = (value: number) => {
    walletPanel.value = value
  }

  return {
    isOpenSideMenu,
    setIsOpenSideMenu,
    walletPanel,
    setWalletPanel,
  }
}
