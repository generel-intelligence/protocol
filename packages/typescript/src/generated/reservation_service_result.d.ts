/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `ReservationServiceResult`'s JSON-Schema
 * via the `definition` "reservationResultSemver".
 */
export type ReservationResultSemver = string;
/**
 * This interface was referenced by `ReservationServiceResult`'s JSON-Schema
 * via the `definition` "reservationResultSha256".
 */
export type ReservationResultSha256 = string;

export interface ReservationServiceResult {
  protocol_version: "0.4.0";
  profile: {
    id: "reservation-service-result";
    version: "0.1.0";
  };
  suite: {
    id: string;
    version: ReservationResultSemver;
    package_digest: ReservationResultSha256;
  };
  task: {
    id: string;
    version: ReservationResultSemver;
  };
  evaluator: {
    id: string;
    version: ReservationResultSemver;
    image_digest: ReservationResultSha256;
  };
  execution_contract: "workspace-snapshot/0.1.0";
  outcome:
    | {
        status: "completed";
        groups: {
          validation: boolean;
          cancellation: boolean;
          idempotency: boolean;
          concurrency: boolean;
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
