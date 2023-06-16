import { Range, List, setIn } from 'immutable'
import { GridState, Coords, CellState } from './types'

export class Grid {
  private _width: number
  private _height: number
  private _state: GridState

  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new RangeError('width and height must be positive and non-zero')
    }

    this._width = width
    this._height = height
    this._state = Range(0, height)
      .map(() => List(Array(width).fill(CellState.Dead)))
      .toList()
  }

  neighbors(point: Coords): Coords[] {
    const [x, y] = point
    const points: Coords[] = []

    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (xOffset === 0 && yOffset === 0) {
          continue // The starting point cannot be a neighbor, so ignore
        }

        const neighbor: Coords = [x + xOffset, y + yOffset]

        if (!this.inBounds(neighbor)) {
          continue
        }

        points.push(neighbor)
      }
    }

    return points
  }

  inBounds(point: Coords): boolean {
    const [x, y] = point
    const xInBounds = x >= 0 && x < this._width
    const yInBounds = y >= 0 && y < this._height

    return xInBounds && yInBounds
  }

  get state() {
    return List(this._state)
  }

  set state(s) {
    this._state = List(s)
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  static toggle(state: GridState, point: Coords): GridState {
    const [x, y] = point
    const cell = Grid.at(state, point)
    const toggle = (c: CellState) => (c === CellState.Alive ? CellState.Dead : CellState.Alive)

    return setIn(state, [y, x], toggle(cell))
  }

  static set(state: GridState, point: Coords, value: CellState) {
    const [x, y] = point
    return setIn(state, [y, x], value)
  }

  static at(state: GridState, point: Coords): CellState {
    const [x, y] = point
    const cell = state.get(y)?.get(x)

    if (cell === undefined) {
      throw new RangeError('Point must be within grid bounds')
    }

    return cell
  }

  static random(width: number, height: number): Grid {
    const grid = new Grid(width, height)

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const random = Math.random() < 0.5
        const cell = random ? CellState.Alive : CellState.Dead
        grid.state = Grid.set(grid.state, [j, i], cell)
      }
    }

    return grid
  }
}
