import { Effect, Layer } from 'effect'
import { PokeApi } from './services'
import { PokemonCollection } from './services/PokemonCollection'
import { BuildPokeApiUrl } from './services/BuildPokeApiUrl'
import { PokeApiUrl } from './services/PokeApiUrl'

const MainLayer = Layer.mergeAll(
  PokeApi.Live,
  PokemonCollection.Live,
  BuildPokeApiUrl.Live,
  PokeApiUrl.Live
)

// program: Full Effect implementation with errors and dependencies included in the type
export const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi
  return yield* pokeApi.getPokemon
})

// runnable: Provide all the dependencies to program to make the third type parameter never
const runnable = program.pipe(Effect.provide(MainLayer))

// main: Handle all (or part of) the errors from runnable to make the second type parameter never
const main = runnable.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed('Fetch error'),
    JsonError: () => Effect.succeed('Json error'),
    ParseError: () => Effect.succeed('Parse error')
  })
)

Effect.runPromise(main).then(console.log)
