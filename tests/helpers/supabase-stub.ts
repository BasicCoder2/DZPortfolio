import { vi, type Mock } from 'vitest'

/**
 * A minimal in-memory stand-in for the PostgREST query builder.
 *
 * Only what the repositories actually call is implemented: `select`, `eq`,
 * `order`, `limit`, `maybeSingle`, `insert`, `update`, `delete` and `single`.
 * The point is not to reimplement PostgREST — it is to let a test say "the
 * table holds these rows" and then assert which of them the repository asked
 * for and returned.
 *
 * Filters are recorded as well as applied, so a test can prove that a query
 * *sent* `status = published` rather than merely that it happened to return
 * published rows. For the draft-exclusion tests that distinction is the whole
 * point: on a real project RLS would hide drafts regardless, and a stub that
 * only checked the output would pass even if the filter were deleted.
 */

export interface StubRow {
  [key: string]: unknown
}

export interface StubTables {
  [table: string]: StubRow[]
}

export interface RecordedQuery {
  table: string
  filters: Array<[string, unknown]>
  operation: 'select' | 'insert' | 'update' | 'delete'
}

/** The subset of the PostgREST builder these tests exercise. */
export interface StubChain {
  select: () => StubChain
  eq: (column: string, value: unknown) => StubChain
  is: (column: string, value: unknown) => StubChain
  order: () => StubChain
  limit: (count: number) => StubChain
  maybeSingle: () => Promise<unknown>
  single: () => Promise<unknown>
  then: (
    onFulfilled: (value: unknown) => unknown,
    onRejected?: (reason: unknown) => unknown
  ) => Promise<unknown>
}

/**
 * Spelled out rather than left as an index signature of `any`.
 *
 * The real client's type is enormous and heavily generic; matching it exactly
 * would be pointless work. Naming just the members under test keeps the stub
 * honest — adding a call the stub does not implement becomes a type error here
 * instead of an undefined-is-not-a-function at run time.
 */
export interface SupabaseStubClient {
  from: (table: string) => {
    select: () => StubChain
    insert: (payload: StubRow) => StubChain
    update: (payload: StubRow) => StubChain
    delete: () => StubChain
  }
  auth: { getUser: Mock }
  storage: { from: () => { remove: Mock; upload: Mock } }
}

export interface SupabaseStub {
  client: SupabaseStubClient
  queries: RecordedQuery[]
  /**
   * Forces the next query on `table` to fail, to exercise error paths.
   *
   * `code` matters: lib/actions/db-errors.ts branches on the PostgreSQL
   * SQLSTATE, so a unique-violation test must send 23505 rather than a generic
   * failure or it will not reach the constraint-mapping branch at all.
   */
  failNext: (table: string, message: string, code?: string) => void
}

export function createSupabaseStub(tables: StubTables): SupabaseStub {
  const queries: RecordedQuery[] = []
  const failures = new Map<string, { message: string; code: string }>()

  function builder(
    table: string,
    operation: RecordedQuery['operation'],
    payload?: StubRow
  ): StubChain {
    const record: RecordedQuery = { table, filters: [], operation }
    queries.push(record)

    let rows = [...(tables[table] ?? [])]

    const resolve = () => {
      const failure = failures.get(table)
      if (failure) {
        failures.delete(table)
        return { data: null, error: { ...failure }, count: null }
      }

      if (operation === 'insert' && payload) {
        const created = { id: `generated-${(tables[table] ?? []).length + 1}`, ...payload }
        tables[table] = [...(tables[table] ?? []), created]
        return { data: [created], error: null, count: 1 }
      }

      if (operation === 'update' && payload) {
        const updated = rows.map((row) => ({ ...row, ...payload }))
        tables[table] = (tables[table] ?? []).map(
          (row) => updated.find((candidate) => candidate.id === row.id) ?? row
        )
        return { data: updated, error: null, count: updated.length }
      }

      if (operation === 'delete') {
        const removedIds = new Set(rows.map((row) => row.id))
        tables[table] = (tables[table] ?? []).filter((row) => !removedIds.has(row.id))
        return { data: rows, error: null, count: rows.length }
      }

      return { data: rows, error: null, count: rows.length }
    }

    const chain: StubChain = {
      select: () => chain,
      eq(column: string, value: unknown) {
        record.filters.push([column, value])
        rows = rows.filter((row) => row[column] === value)
        return chain
      },
      is(column: string, value: unknown) {
        record.filters.push([column, value])
        rows = rows.filter((row) => (row[column] ?? null) === value)
        return chain
      },
      order() {
        return chain
      },
      limit(count: number) {
        rows = rows.slice(0, count)
        return chain
      },
      maybeSingle() {
        const result = resolve()
        const data = Array.isArray(result.data) ? (result.data[0] ?? null) : result.data
        return Promise.resolve({ ...result, data })
      },
      single() {
        const result = resolve()
        const data = Array.isArray(result.data) ? (result.data[0] ?? null) : result.data
        if (!result.error && data === null) {
          return Promise.resolve({
            data: null,
            error: { message: 'No rows found', code: 'PGRST116' },
          })
        }
        return Promise.resolve({ ...result, data })
      },
      then(onFulfilled: (value: unknown) => unknown, onRejected?: (reason: unknown) => unknown) {
        return Promise.resolve(resolve()).then(onFulfilled, onRejected)
      },
    }

    return chain
  }

  return {
    client: {
      from: (table: string) => ({
        select: () => builder(table, 'select'),
        insert: (payload: StubRow) => builder(table, 'insert', payload),
        update: (payload: StubRow) => builder(table, 'update', payload),
        delete: () => builder(table, 'delete'),
      }),
      auth: { getUser: vi.fn() },
      storage: { from: () => ({ remove: vi.fn(), upload: vi.fn() }) },
    },
    queries,
    failNext(table, message, code = 'PGRST999') {
      failures.set(table, { message, code })
    },
  }
}
