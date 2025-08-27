import QRCodeStyling, { type DrawType, type DotType } from 'qr-code-styling'
import { ref } from 'vue'

export const useQR = () => {
  /** -------------------
 * QR Code Controls
 -------------------*/
  const isLoadingQRCode = ref(true)

  const options = ref({
    width: 150,
    height: 150,
    type: 'svg' as DrawType,
    data: '',
    image: '',
    margin: 0,
    dotsOptions: {
      color: '#000',
      type: 'extra-rounded' as DotType,
    },
    cornersDotOptions: {
      color: 'rgb(0,90,229,1)',
      type: 'extra-rounded' as DotType,
    },
    backgroundOptions: {
      color: 'transparent',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 10,
    },
  })

  const qrCode = ref<HTMLDivElement | null>(null)
  const qrCodeStyling = new QRCodeStyling(options.value)

  const setQRCode = (
    data: string | undefined,
    width: number | undefined = undefined,
    height: number | undefined = undefined,
    image: string | undefined = undefined,
  ) => {
    try {
      isLoadingQRCode.value = true
      if (data) {
        options.value.data = data
      }
      if (image) {
        options.value.image = image
      }
      if (width) {
        options.value.width = width
      }
      if (height) {
        options.value.height = height
      }
      qrCodeStyling.update(options.value)
      isLoadingQRCode.value = false
      if (qrCode.value) {
        qrCodeStyling.append(qrCode.value)
      }
    } catch (error) {
      console.error('Failed to append QR Code:', error)
    }
  }
  return {
    qrCode,
    isLoadingQRCode,
    setQRCode,
  }
}
