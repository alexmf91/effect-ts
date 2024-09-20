import { Effect, Layer, ManagedRuntime } from 'effect'
import { afterAll, afterEach, beforeAll, expect, it } from 'vitest'

import { server } from '../utils/test/node'
import { PokeApi } from '../services'
import { program } from '../index'
import { TestConfigProviderLayer } from '../utils/test/testConfigProvider'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const TestMainLayer = PokeApi.Mock.pipe(Layer.provide(TestConfigProviderLayer))

const TestingRuntime = ManagedRuntime.make(TestMainLayer)

it('returns a valid pokemon', async () => {
  const response = await TestingRuntime.runPromise(program)
  expect(response).toEqual({
    id: 1,
    height: 10,
    weight: 10,
    order: 1,
    name: 'myname'
  })
})
