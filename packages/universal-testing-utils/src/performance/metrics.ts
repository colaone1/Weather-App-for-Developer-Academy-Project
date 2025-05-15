export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  timestamp: number;
}

export class PerformanceTracker {
  private startTime: number;
  private startMemory: number;

  constructor() {
    this.startTime = performance.now();
    this.startMemory = process.memoryUsage().heapUsed;
  }

  measure(): PerformanceMetrics {
    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    return {
      executionTime: endTime - this.startTime,
      memoryUsage: endMemory - this.startMemory,
      timestamp: Date.now(),
    };
  }

  static async measureAsync<T>(
    fn: () => Promise<T>
  ): Promise<{ result: T; metrics: PerformanceMetrics }> {
    const tracker = new PerformanceTracker();
    const result = await fn();
    const metrics = tracker.measure();
    return { result, metrics };
  }
}

export const createPerformanceTracker = () => new PerformanceTracker(); 