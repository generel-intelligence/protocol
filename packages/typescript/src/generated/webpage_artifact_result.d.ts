/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `WebpageArtifactResult`'s JSON-Schema
 * via the `definition` "webpageResultSemver".
 */
export type WebpageResultSemver = string;
/**
 * This interface was referenced by `WebpageArtifactResult`'s JSON-Schema
 * via the `definition` "webpageResultSha256".
 */
export type WebpageResultSha256 = string;

export interface WebpageArtifactResult {
  protocol_version: "0.7.0";
  profile: {
    id: "webpage-artifact-result";
    version: "0.1.0";
  };
  suite: {
    id: string;
    version: WebpageResultSemver;
    package_digest: WebpageResultSha256;
  };
  task: {
    id: string;
    version: WebpageResultSemver;
  };
  evaluator: {
    id: string;
    version: WebpageResultSemver;
    image_digest: WebpageResultSha256;
  };
  execution_contract: "workspace-snapshot/0.1.0";
  outcome:
    | {
        status: "completed";
        groups: {
          deliverable: boolean;
          html_document: boolean;
          self_contained: boolean;
          requested_surface: boolean;
        };
        passed_count: number;
        total_count: 4;
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
