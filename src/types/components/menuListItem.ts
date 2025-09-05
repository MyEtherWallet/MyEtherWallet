export enum ICON_IDS {
  'BUY' = 'buy',
  'SWAP' = 'swap',
  'SEND' = 'send',
  'STAKE' = 'stake',
  'PORTFOLIO' = 'portfolio',
  'TOOLS' = 'tools',
  'SETTINGS' = 'settings',
  'HELP' = 'help',
  'NOTIFICATIONS' = 'notifications',
  'LEARN' = 'learn',
}
export interface AppMenuListItem {
  iconID?: ICON_IDS
  title: string
  routeName?: string
}
