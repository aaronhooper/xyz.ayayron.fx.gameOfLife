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
          h: 1080 - 150 - 75,
          rect: true,
          color: 0xffff0000,
          Cell: {
            type: Cell,
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
          GenerationNumber: {
            x: -50,
            color: 0x88ffffff,
            text: {
              text: 'Generation #42',
            },
          },
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

class Cell extends Lightning.Component {
  static get size() {
    return 50
  }

  static override _template() {
    return {
      w: Cell.size,
      h: Cell.size,
      rect: true,
      color: 0xffffffff,
      shader: {
        type: Lightning.shaders.RoundedRectangle,
        radius: 10,
      },
    }
  }
}
