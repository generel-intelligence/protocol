/* Generated from JSON Schema. Do not edit. */

/**
 * This interface was referenced by `WorkspaceCheckpointManifest`'s JSON-Schema
 * via the `definition` "path".
 */
export type Path = string;

export interface WorkspaceCheckpointManifest {
  protocol_version: "0.6.0";
  checkpoint_id: string;
  workspace_context_id: string;
  files: {
    [k: string]: File;
  };
  total_byte_size: number;
}
/**
 * This interface was referenced by `WorkspaceCheckpointManifest`'s JSON-Schema
 * via the `definition` "file".
 */
export interface File {
  digest: string;
  byte_size: number;
}
