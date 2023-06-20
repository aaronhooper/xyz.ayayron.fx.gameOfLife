import { Lightning, Utils } from '@lightningjs/sdk'
import { Game } from './conway/game'
import { Grid } from './conway/grid'

export class App extends Lightning.Component {
  readonly Background = this.getByRef('Background')!

  static override _template() {
    return {
      w: 1920,
      h: 1080,
      Background: {
        w: 1920,
        h: 1080,
        color: 0xfffbb03b,
        src: Utils.asset('images/background.png'),
      },
      Foreground: {
        w: 1920,
        h: 1080,
        rect: true,
        color: 0x220000ff,
        flex: {
          direction: 'column',
        },
        Header: {
          w: 1920,
          h: 150,
          flex: {
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          },
          Title: {
            text: {
              text: 'Game of Life',
              fontSize: 60,
            },
          },
        },
        Main: { type: Main },
        Footer: {
          w: 1920,
          h: 75,
          flex: {
            direction: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          },
          GenerationNumber: { type: GenerationNumber },
        },
      },
    }
  }

  override _getFocused() {
    return this.tag('Foreground.Main')
  }

  static getFonts() {
    return [
      {
        family: 'Regular',
        url: Utils.asset('fonts/Roboto-Regular.ttf') as string,
      },
    ]
  }
}

class GridContainer extends Lightning.Component {
  static override _template() {
    return {
      w: 1536,
      h: 684,
      flex: {
        direction: 'column' as FlexDirection,
      },
      CellGrid: {
        type: CellGrid,
        passSignals: { cellWasToggled: true },
      },
    }
  }
}

class ButtonGroup extends Lightning.Component {
  static override _template() {
    return {
      w: 1536,
      h: 171,
      flex: {
        justifyContent: 'space-evenly' as FlexJustifyContent,
        alignItems: 'flex-start' as FlexAlignItems,
      },
      StartButton: {
        type: Button,
        buttonText: 'Start',
      },
      StopButton: {
        type: Button,
        buttonText: 'Stop',
      },
    }
  }
}

class Button extends Lightning.Component {
  buttonText: string | undefined

  static override _template() {
    return {
      color: 0x11ffffff,
      texture: Lightning.Tools.getRoundRect(200 * 2, 40 * 2, 4),
      flex: {
        justifyContent: 'center' as FlexJustifyContent,
        alignItems: 'center' as FlexAlignItems,
      },
      Label: {
        color: 0xaaffffff,
        text: { fontSize: 20 * 2 },
      },
    }
  }

  override _focus() {
    this.patch({ smooth: { scale: 1.25 }, zIndex: 1 })
  }

  override _unfocus() {
    this.patch({ smooth: { scale: 1 }, zIndex: 0 })
  }

  override _init() {
    this.tag('Label').patch({ text: { text: this.buttonText } })
  }

  //   _handleEnter() {
  //     this.toggle = !this.toggle
  //     if (this.toggle) {
  //       this.buttonColor = this.buttonColor === 0xffff00ff ? 0xff00ffff : 0xffff00ff
  //     }
  //     this.signal('toggleText', this.toggle, this.buttonColor)
  //   }
}

class CellRow extends Lightning.Component {
  static override _template() {
    return {
      w: 1536,
      h: Cell.size,
      flex: {
        direction: 'row' as FlexDirection,
        justifyContent: 'center' as FlexJustifyContent,
        alignItems: 'center' as FlexAlignItems,
      },
    }
  }

  override _init() {
    const length = Math.floor(1536 / Cell.size)
    this.children = Array.from(Array(length)).map(() => ({
      type: Cell,
      passSignals: { cellWasToggled: true },
    }))
  }
}

class CellGrid extends Lightning.Component {
  static override _template() {
    return {
      w: 1536,
      h: 684,
      flex: {
        direction: 'column' as FlexDirection,
      },
    }
  }

  override _init() {
    const length = Math.floor(684 / Cell.size)
    this.children = Array.from(Array(length)).map(() => ({
      type: CellRow,
      passSignals: { cellWasToggled: true },
    }))
  }
}

class Cell extends Lightning.Component {
  static get size() {
    return 50
  }

  static override _template() {
    return {
      w: Cell.size,
      h: Cell.size,
      rect: true,
      color: 0xff000000,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 10,
        stroke: 1.25,
        strokeColor: 0x88ffffff,
      },
    }
  }

  override _focus() {
    this.patch({ smooth: { scale: 1.25 }, zIndex: 1 })
  }

  override _unfocus() {
    this.patch({ smooth: { scale: 1 }, zIndex: 0 })
  }

  override _handleEnter() {
    this.signal('cellWasToggled')
    this.toggle()
  }

  toggle() {
    const color = this.color === 0xffffffff ? 0xff000000 : 0xffffffff
    this.patch({ color })
  }
}

class GenerationNumber extends Lightning.Component {
  static override _template() {
    return {
      x: -50,
      color: 0x88ffffff,
      text: {
        text: 'Generation #42',
      },
    }
  }

  static createLabel(n: number) {
    return `Generation #${n}`
  }

  override _init() {
    this.patch({ text: { text: GenerationNumber.createLabel(0) } })
  }
}

class Main extends Lightning.Component {
  gridFocusCoords!: Coords
  isGridFocused!: boolean
  buttonFocusIndex!: number
  gameState!: Game

  readonly CellGrid = this.tag('GridContainer.CellGrid')

  static override _template() {
    return {
      w: 1920,
      h: 855,
      flex: {
        direction: 'column' as FlexDirection,
        justifyContent: 'center' as FlexJustifyContent,
        alignItems: 'center' as FlexAlignItems,
      },
      GridContainer: {
        type: GridContainer,
        signals: { cellWasToggled: true },
      },
      ButtonGroup: {
        type: ButtonGroup,
      },
    }
  }

  override _init() {
    this.gridFocusCoords = [0, 0]
    this.buttonFocusIndex = 0
    this.isGridFocused = true

    const width = this.CellGrid.children[0].children.length
    const height = this.CellGrid.children.length
    this.gameState = new Game(new Grid(width, height))
  }

  override _getFocused() {
    if (this.isGridFocused) {
      const [x, y] = this.gridFocusCoords
      return this.tag('GridContainer.CellGrid').children[y].children[x]
    }

    const i = this.buttonFocusIndex
    return this.getByRef('ButtonGroup').children[i]
  }

  override _handleLeft() {
    const [x] = this.gridFocusCoords

    if (this.isGridFocused && x > 0) {
      this.gridFocusCoords[0] = x - 1
    } else {
      this.buttonFocusIndex = 0
    }
  }

  override _handleRight() {
    const [x, y] = this.gridFocusCoords
    const length = this.CellGrid.children[y].children.length

    if (this.isGridFocused && x < length - 1) {
      this.gridFocusCoords[0] = x + 1
    } else {
      this.buttonFocusIndex = 1
    }
  }

  override _handleUp() {
    const [, y] = this.gridFocusCoords

    if (!this.isGridFocused) {
      this.isGridFocused = !this.isGridFocused
    } else if (y > 0) {
      this.gridFocusCoords![1] = y - 1
    }
  }

  override _handleDown() {
    const [, y] = this.gridFocusCoords
    const length = this.CellGrid.children.length

    if (this.isGridFocused) {
      if (y < length - 1) {
        this.gridFocusCoords![1] = y + 1
      } else {
        this.isGridFocused = !this.isGridFocused
      }
    }
  }

  cellWasToggled() {
    this.gameState.grid.state = Grid.toggle(this.gameState.grid.state, this.gridFocusCoords)
  }
}
