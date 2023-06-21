import { Game } from '../conway/game'
import { Grid } from '../conway/grid'
import { Coords } from '../conway/types'

describe('Game', () => {
  it('renders a "blinker"', () => {
    const gen0 = new Grid(5, 5)
    const gen0Coords: Coords[] = [
      [1, 0],
      [1, 1],
      [1, 2],
    ]

    for (const point of gen0Coords) {
      gen0.state = Grid.toggle(gen0.state, point)
    }

    const gen1 = new Grid(5, 5)
    const gen1Coords: Coords[] = [
      [0, 1],
      [1, 1],
      [2, 1],
    ]

    for (const point of gen1Coords) {
      gen1.state = Grid.toggle(gen1.state, point)
    }

    const game = new Game(gen0)

    game.next()
    expect(game.grid.state).toEqual(gen1.state)

    game.next()
    expect(game.grid.state).toEqual(gen0.state)
  })

  it('renders a "beacon"', () => {
    const gen0 = new Grid(6, 6)
    const gen0Coords: Coords[] = [
      [1, 1],
      [1, 2],
      [2, 1],
      [2, 2],
      [3, 3],
      [3, 4],
      [4, 3],
      [4, 4],
    ]

    for (const point of gen0Coords) {
      gen0.state = Grid.toggle(gen0.state, point)
    }

    const gen1 = new Grid(6, 6)
    const gen1Coords: Coords[] = [
      [2, 2],
      [3, 3],
    ]

    gen1.state = gen0.state

    for (const point of gen1Coords) {
      gen1.state = Grid.toggle(gen1.state, point)
    }

    const game = new Game(gen0)

    game.next()
    expect(game.grid.state).toEqual(gen1.state)

    game.next()
    expect(game.grid.state).toEqual(gen0.state)
  })

  it('renders a "toad"', () => {
    const gen0 = new Grid(6, 6)
    const gen0Coords: Coords[] = [
      [2, 2],
      [2, 3],
      [2, 4],
      [3, 1],
      [3, 2],
      [3, 3],
    ]

    for (const point of gen0Coords) {
      gen0.state = Grid.toggle(gen0.state, point)
    }

    const gen1 = new Grid(6, 6)
    const gen1Coords: Coords[] = [
      [1, 3],
      [2, 1],
      [2, 4],
      [3, 1],
      [3, 4],
      [4, 2],
    ]

    for (const point of gen1Coords) {
      gen1.state = Grid.toggle(gen1.state, point)
    }

    const game = new Game(gen0)

    game.next()
    expect(game.grid.state).toEqual(gen1.state)

    game.next()
    expect(game.grid.state).toEqual(gen0.state)
  })
})
