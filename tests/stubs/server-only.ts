/**
 * Stub for the `server-only` package.
 *
 * The real module throws on import unless the bundler resolved it under the
 * `react-server` condition — which is exactly what makes it useful in the
 * application, and exactly what makes it unimportable from a plain Node test
 * runner. Vitest aliases the specifier here (see vitest.config.ts).
 *
 * This does not weaken the guarantee it provides. The check that matters
 * happens at build time, where Next resolves the real package and fails the
 * build if a client component reaches server-only code.
 */
export {}
