import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { randomBytes } from 'crypto';

export type PostgresConnectionInfo = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  containerId?: string;
};

function generatePassword() {
  return randomBytes(12).toString('base64');
}

export async function startDatabase(opts?: {
  database?: string;
  username?: string;
  password?: string;
  reuse?: boolean;
}): Promise<PostgresConnectionInfo> {
  const database = opts?.database ?? process.env.POSTGRES_DB ?? 'pokemon';
  const username = opts?.username ?? process.env.POSTGRES_USER ?? 'postgres';
  const password = opts?.password ?? process.env.POSTGRES_PASSWORD ?? generatePassword();
  const reuse = opts?.reuse ?? (process.env.TESTCONTAINERS_REUSE === 'true');

  const container = new PostgreSqlContainer()
    .withDatabase(database)
    .withUsername(username)
    .withPassword(password);

  if (reuse) {
    container.withReuse();
  }

  try {
    const started = await container.start();

    const info: PostgresConnectionInfo = {
      host: started.getHost(),
      port: started.getMappedPort(5432),
      database,
      username,
      password,
      containerId: started.getId?.() ?? undefined,
    };

    // If you need env-compatibility, set variables only if not already present
    process.env.POSTGRES_HOST = process.env.POSTGRES_HOST ?? info.host;
    process.env.POSTGRES_PORT = process.env.POSTGRES_PORT ?? String(info.port);
    process.env.POSTGRES_DB = process.env.POSTGRES_DB ?? info.database;
    process.env.POSTGRES_USER = process.env.POSTGRES_USER ?? info.username;
    process.env.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD ?? info.password;

    console.log('[startDatabase] Postgres container started:', {
      host: info.host,
      port: info.port,
      database: info.database,
      username: info.username,
      // DO NOT log password
    });

    process.on('SIGINT', async () => {
      await started.stop();
      process.exit();
    });

    return info;
  } catch (err) {
    console.error('[startDatabase] Failed to start Postgres container:', err);
    throw err;
  }
};