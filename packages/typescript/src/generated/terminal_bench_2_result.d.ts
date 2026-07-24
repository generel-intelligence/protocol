/* Generated from JSON Schema. Do not edit. */

export interface TerminalBench2Result {
  protocol_version: "0.1.0";
  profile: {
    id: "terminal-bench-2-result";
    version: "0.1.0";
  };
  benchmark: BenchmarkReference;
  raw_artifact: ArtifactReference;
  mapping: {
    version: "0.1.0";
    implementation_digest: string;
    warnings: string[];
    unmapped_fields: string[];
  };
  outcome:
    | {
        status: "completed";
        reward: number;
        passed: boolean;
      }
    | {
        status: "error";
        error_code: string;
      }
    | {
        status: "not_run";
        reason: string;
      };
}
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
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
