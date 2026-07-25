/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `ExpenseReportResult`'s JSON-Schema
 * via the `definition` "resultSemver".
 */
export type ResultSemver = string;
/**
 * This interface was referenced by `ExpenseReportResult`'s JSON-Schema
 * via the `definition` "resultSha256".
 */
export type ResultSha256 = string;

export interface ExpenseReportResult {
  protocol_version: "0.2.0";
  profile: {
    id: "expense-report-result";
    version: "0.1.0";
  };
  suite: {
    id: string;
    version: ResultSemver;
    package_digest: ResultSha256;
  };
  task: {
    id: string;
    version: ResultSemver;
  };
  evaluator: {
    id: string;
    version: ResultSemver;
    image_digest: ResultSha256;
  };
  execution_contract: "workspace-snapshot/0.1.0";
  outcome:
    | {
        status: "completed";
        groups: {
          status: boolean;
          dates: boolean;
          refunds: boolean;
          currencies: boolean;
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
