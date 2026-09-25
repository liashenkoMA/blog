export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options: { EX: number }): Promise<unknown>;
  scanIterator(options?: { MATCH?: string }): AsyncIterable<string[]>;
  del(key: string): Promise<number>;
}
