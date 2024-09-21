import { Schema } from '@effect/schema'

const HeightFormat = Schema.Number.pipe(
  Schema.transform(Schema.String, {
    decode: (from) => `${from}cm`,
    encode: (to) => Number(to.substring(0, to.length - 2))
  })
)

export class Pokemon extends Schema.Class<Pokemon>('Pokemon')({
  id: Schema.Number,
  order: Schema.Number,
  name: Schema.String,
  height: HeightFormat,
  weight: Schema.Number
}) {}

export const decodePokemon = Schema.decodeUnknown(Pokemon)
