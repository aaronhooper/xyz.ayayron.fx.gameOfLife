import { Grid } from "../conway/grid";
import { List } from "immutable";
import { CellState } from "../conway/types";

describe('Grid', () => {
  it('initialises to dead cells', () => {
    const grid = new Grid(3, 3)
    const state = grid.state
    const result = state

    function* generateGrid(width: number, height: number): Generator<List<CellState>> {
      for (let i = 0; i < height; i++) {
        let row: List<CellState> = List([])

        for (let j = 0; j < width; j++) {
          row = row.push(CellState.Dead)
        }

        yield row
      }
    }

    const expected = List(generateGrid(3, 3))
    expect(result).toEqual(expected)
  })
})
