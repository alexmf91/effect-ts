import { Effect, Context, ConfigError, Config, Layer } from 'effect'
import { decodePokemon, type Pokemon } from '../schemas'
import { FetchError, JsonError } from '../errors'
import type { ParseResult } from '@effect/schema'
import { BuildPokeApiUrl } from './BuildPokeApiUrl'
import { PokemonCollection } from './PokemonCollection'

export interface PokeApiImpl {
  readonly getPokemon: Effect.Effect<Pokemon, FetchError | JsonError | ParseResult.ParseError | ConfigError.ConfigError>
}

const make = {
  getPokemon: Effect.gen(function* () {
    const pokemonCollection = yield* PokemonCollection
    const buildPokeApiUrl = yield* BuildPokeApiUrl

    const requestUrl = buildPokeApiUrl({ name: pokemonCollection[0] })

    const response = yield* Effect.tryPromise({
      try: () => fetch(requestUrl),
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
}

export class PokeApi extends Context.Tag('PokeApi')<PokeApi, typeof make>() {
  static readonly Live = Layer.succeed(this, make)

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
