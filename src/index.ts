import { Effect, Layer, ManagedRuntime } from 'effect'
import { PokeApi } from './services'

const MainLayer = Layer.mergeAll(PokeApi.Live)

// managedRuntime: Allows to derive a Runtime from a Layer. Includes all the services inside the layer we provide
const PokemonRuntime = ManagedRuntime.make(MainLayer)

// program: Full Effect implementation with errors and dependencies included in the type
export const program = Effect.gen(function* () {
  const pokeApi = yield* PokeApi
  return yield* pokeApi.getPokemon
})

// main: Handle all (or part of) the errors from runnable to make the second type parameter never
const main = program.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed('Fetch error'),
    JsonError: () => Effect.succeed('Json error'),
    ParseError: () => Effect.succeed('Parse error')
  })
)

PokemonRuntime.runPromise(main).then(console.log)
