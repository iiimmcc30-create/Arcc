/**
 * Resolve a Postgres connection URL from the env names Railway and local
 * setups commonly use.
 */
export function resolveDatabaseUrl(
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  const candidates = [
    env.DATABASE_URL,
    env.DATABASE_PRIVATE_URL,
    env.POSTGRES_URL,
    env.POSTGRES_PRIVATE_URL,
    env.POSTGRESQL_URL,
  ];
  for (const value of candidates) {
    if (value && value.trim()) return value.trim();
  }

  // Railway Postgres plugin also exposes discrete PG* vars when referenced.
  const host = env.PGHOST || env.DB_HOST;
  const user = env.PGUSER || env.DB_USERNAME;
  const password = env.PGPASSWORD || env.DB_PASSWORD;
  const database = env.PGDATABASE || env.DB_DATABASE;
  const port = env.PGPORT || env.DB_PORT || '5432';
  if (host && user && password && database) {
    const encUser = encodeURIComponent(user);
    const encPass = encodeURIComponent(password);
    return `postgresql://${encUser}:${encPass}@${host}:${port}/${database}`;
  }

  return undefined;
}

export function listPresentDbEnvKeys(env: NodeJS.ProcessEnv = process.env): string[] {
  const keys = [
    'DATABASE_URL',
    'DATABASE_PRIVATE_URL',
    'POSTGRES_URL',
    'POSTGRES_PRIVATE_URL',
    'POSTGRESQL_URL',
    'PGHOST',
    'PGUSER',
    'PGPASSWORD',
    'PGDATABASE',
    'PGPORT',
    'DB_HOST',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'DB_PORT',
    'DB_SSL',
  ];
  return keys.filter((key) => Boolean(env[key] && String(env[key]).trim()));
}
