/* Generated from JSON Schema. Do not edit. */

export interface TraceEvent {
  protocol_version: "0.1.0";
  run_id: string;
  sequence: number;
  event_id: string;
  profile: ProfileReference;
  producer: {
    kind: "runner" | "evaluator" | "importer";
    id: string;
    version: string;
  };
  occurred_at: string;
  captured_at: string;
  capture: {
    status: "complete" | "partial" | "unavailable";
    warnings: string[];
  };
  artifacts: ArtifactReference[];
  payload:
    | {
        type: "run_started";
      }
    | {
        type: "task_started";
        task_id: string;
      }
    | {
        type: "task_finished";
        task_id: string;
        outcome: "passed" | "failed" | "error";
      }
    | {
        type: "run_finished";
        outcome: "completed" | "failed" | "cancelled" | "abandoned";
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
