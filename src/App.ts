import { Lightning, Utils } from '@lightningjs/sdk'

export class App extends Lightning.Component {
  /*
   * The following properties exist to make it more convenient to access elements
   * below in a type-safe way. They are optional.
   *
   * See https://lightningjs.io/docs/#/lightning-core-reference/TypeScript/Components/TemplateSpecs?id=using-a-template-spec
   * for more information.
   */
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
        Main: {
          w: 1920,
          h: 855,
          flex: {
            direction: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
          GridContainer: {
            type: GridContainer,
          },
          ButtonGroup: {
            type: ButtonGroup,
          },
        },
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

  static getFonts() {
    return [
      {
        family: 'Regular',
        url: Utils.asset('fonts/Roboto-Regular.ttf') as string,
      },
    ]
  }
}

type FlexAlignItems = 'flex-end' | 'center' | 'flex-start' | 'stretch' | undefined
type FlexJustifyContent =
  | 'flex-end'
  | 'center'
  | 'flex-start'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  | undefined

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

type FlexDirection = 'row' | 'column' | undefined

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
        strokeColor: 0xffffffff,
      },
    }
  }
}

class GenerationNumber extends Lightning.Component {
  n: number | undefined

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
