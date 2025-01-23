

export interface Tab {
  name: string
  routeName?: string
  id: string
  controlsPanel: string
}

export interface Tab_Panel {
  id: string
  ariaLabelledBy: string
  routeName?: string
}
