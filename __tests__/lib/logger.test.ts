import { logger } from '@/lib/logger';

describe('Logger utility', () => {
  it('should export a valid pino instance', () => {
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
  });
});
