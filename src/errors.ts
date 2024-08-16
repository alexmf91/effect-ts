import { Data } from 'effect'

export class FetchError extends Data.TaggedError('FetchError')<Readonly<{}>> {}

export class JsonError extends Data.TaggedError('JsonError')<Readonly<{}>> {}
