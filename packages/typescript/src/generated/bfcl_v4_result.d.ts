/* Generated from JSON Schema. Do not edit. */

export interface BFCLV4Result {
  protocol_version: "0.1.0";
  profile: {
    id: "bfcl-v4-result";
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
        test_category:
          | "simple_python"
          | "simple_java"
          | "simple_javascript"
          | "multiple"
          | "parallel"
          | "parallel_multiple"
          | "irrelevance"
          | "live_simple"
          | "live_multiple"
          | "live_parallel"
          | "live_parallel_multiple"
          | "live_irrelevance"
          | "live_relevance"
          | "multi_turn_base"
          | "multi_turn_miss_func"
          | "multi_turn_miss_param"
          | "multi_turn_long_context"
          | "web_search_base"
          | "web_search_no_snippet"
          | "memory_kv"
          | "memory_vector"
          | "memory_rec_sum"
          | "format_sensitivity";
        accuracy: number;
        correct_count?: number;
        total_count?: number;
        partial_evaluation: boolean;
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
