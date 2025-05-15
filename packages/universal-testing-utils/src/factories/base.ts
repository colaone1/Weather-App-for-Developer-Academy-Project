export interface Factory<T> {
  build(overrides?: Partial<T>): T;
  buildMany(count: number, overrides?: Partial<T>): T[];
}

export abstract class BaseFactory<T> implements Factory<T> {
  protected abstract generate(): T;

  build(overrides: Partial<T> = {}): T {
    return {
      ...this.generate(),
      ...overrides,
    };
  }

  buildMany(count: number, overrides: Partial<T> = {}): T[] {
    return Array.from({ length: count }, () => this.build(overrides));
  }
} 