import { registerAs } from '@nestjs/config';

export default registerAs('shutdown', () => {
  const timeoutMs = Number(process.env.GRACEFUL_SHUTDOWN_TIMEOUT_MS ?? 0);

  return {
    gracefulShutdownTimeoutMs: Number.isFinite(timeoutMs)
      ? timeoutMs
      : 0
  };
});
