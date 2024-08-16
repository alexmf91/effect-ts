import { Effect } from 'effect'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

import { server } from '../utils/test/node'
import { PokeApi } from '../services'
import { program } from '../index'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const mainTest = program.pipe(Effect.provideService(PokeApi, PokeApi.Test))

it('returns a valid pokemon', async () => {
  const response = await Effect.runPromise(mainTest)
  expect(response).toEqual({
    id: 1,
    height: 10,
    weight: 10,
    order: 1,
    name: 'myname'
  })
})
