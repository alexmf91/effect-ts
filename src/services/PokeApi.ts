import { Effect, Context, ConfigError, Config } from 'effect'
import { decodePokemon, type Pokemon } from '../schemas'
import { FetchError, JsonError } from '../errors'
import type { ParseResult } from '@effect/schema'

export interface PokeApiImpl {
  readonly getPokemon: Effect.Effect<
    typeof Pokemon.Type,
    FetchError | JsonError | ParseResult.ParseError | ConfigError.ConfigError
  >
}

export class PokeApi extends Context.Tag('PokeApi')<PokeApi, PokeApiImpl>() {
  static readonly Live = PokeApi.of({
    getPokemon: Effect.gen(function* () {
      const baseUrl = yield* Config.string('BASE_URL')

      const response = yield* Effect.tryPromise({
        try: () => fetch(`${baseUrl}/api/v2/pokemon/garchomp/`),
        catch: () => new FetchError()
      })

      if (!response.ok) {
        return yield* new FetchError()
      }

      const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError()
      })

      return yield* decodePokemon(json)
    })
  })

  static readonly Test = PokeApi.of({
    getPokemon: Effect.gen(function* () {
      const response = yield* Effect.tryPromise({
        try: () => fetch(`http://localhost:3000/api/v2/pokemon/garchomp/`),
        catch: () => new FetchError()
      })

      if (!response.ok) {
        return yield* new FetchError()
      }

      const json = yield* Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonError()
      })

      return yield* decodePokemon(json)
    })
  })
}
