export interface TokenAllocation {
  name: string
  symbol: string
  icon?: string
  percentage: BigNumber
  formattedPercentage: string
  percentageNumber: number
  id?: string
}

export const ALLOCATION_COLORS = [
  'rgba(0,90,229,1)', //primary
  '#9D00FF', //purple
  'rgba(228,12,91,1)', //red
  'rgba(5,192,165,1)', //teal
  'rgba(255,165,0,1)', //orange
  'rgba(0,0,0,0.7)', //others
]
