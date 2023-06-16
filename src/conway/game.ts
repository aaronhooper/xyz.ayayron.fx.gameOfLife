import { Coords, CellState } from './types'
import { Grid } from './grid'

export class Game {
  private _grid: Grid
  private _generation: number

  constructor(grid: Grid) {
    this._grid = grid
    this._generation = 0
  }

  get grid() {
    return this._grid
  }

  get generation() {
    return this._generation
  }

  next() {
    let nextGridState = this.grid.state

    for (let i = 0; i < this.grid.height; i++) {
      for (let j = 0; j < this.grid.width; j++) {
        const point: Coords = [j, i]
        const cellState = Grid.at(this.grid.state, point)
        const cellIsAlive = (p: Coords) => Grid.at(this.grid.state, p) === CellState.Alive

        const liveNeighborCount = this.grid.neighbors(point).filter(cellIsAlive).length

        if (cellState === CellState.Alive && (liveNeighborCount < 2 || liveNeighborCount > 3)) {
          nextGridState = Grid.toggle(nextGridState, point)
        } else if (cellState === CellState.Dead && liveNeighborCount === 3) {
          nextGridState = Grid.toggle(nextGridState, point)
        }
      }
    }

    this.grid.state = nextGridState
    this._generation += 1
  }
}
