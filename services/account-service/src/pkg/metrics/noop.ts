import type { Metrics } from "./interface.js";
import type { Metric } from "./metric.js";
export class NoopMetrics implements Metrics {
  public emit(_metric: Metric): Promise<void> {
    return Promise.resolve();
  }

  public async flush(): Promise<void> {}
}
