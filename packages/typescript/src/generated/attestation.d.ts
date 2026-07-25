/* Generated from JSON Schema. Do not edit. */

export interface Attestation {
  protocol_version: "0.1.0";
  attestation_id: string;
  kind: "schema_validated" | "source_attested" | "upstream_verified" | "generel_reproduced";
  issuer: string;
  issued_at: string;
  subject_digest: string;
  method: string;
  evidence: ArtifactReference[];
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
