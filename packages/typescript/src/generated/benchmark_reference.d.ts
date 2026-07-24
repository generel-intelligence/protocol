/* Generated from JSON Schema. Do not edit. */

export interface BenchmarkReference {
  protocol_version: "0.1.0";
  profile: ProfileReference;
  benchmark_family: string;
  dataset: {
    uri: string;
    revision: string;
    digest: string;
  };
  task: {
    upstream_id: string;
    digest?: string;
  };
  evaluator: {
    release: string;
    config_digest: string;
    image_digest?: string;
  };
}
export interface ProfileReference {
  id: string;
  version: string;
}
