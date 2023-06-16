import { List } from 'immutable'

export enum CellState {
  Dead = 'DEAD',
  Alive = 'ALIVE',
}

export type Coords = [x: number, y: number]
export type GridState = List<List<CellState>>
