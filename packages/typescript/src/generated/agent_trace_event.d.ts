/* Generated from JSON Schema. Do not edit. */

export interface AgentTraceEvent {
  protocol_version: "0.3.0";
  run_id: string;
  sequence: number;
  event_id: string;
  profile: ProfileReference;
  producer: Producer;
  source: Source;
  relationships: Relationship[];
  occurred_at: string;
  captured_at: string;
  capture: Capture;
  artifacts: ArtifactReference[];
  payload:
    | RunStarted
    | TaskStarted
    | TaskFinished
    | RunFinished
    | ConversationMessage
    | ModelRequest
    | ModelResponseStarted
    | ModelResponseFinished
    | ToolFinished
    | WorkspaceCheckpoint
    | ExecutionError;
}
export interface ProfileReference {
  id: string;
  version: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "producer".
 */
export interface Producer {
  kind: "runner" | "evaluator" | "importer";
  id: string;
  version: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "source".
 */
export interface Source {
  kind: "runner" | "harness" | "model_gateway" | "workspace" | "container";
  id: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "relationship".
 */
export interface Relationship {
  type: "parent" | "responds_to" | "caused_by" | "checkpoint_after";
  event_id: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "capture".
 */
export interface Capture {
  status: "complete" | "partial" | "unavailable";
  warnings: string[];
}
export interface ArtifactReference {
  artifact_id: string;
  digest: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "runStarted".
 */
export interface RunStarted {
  type: "run_started";
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "taskStarted".
 */
export interface TaskStarted {
  type: "task_started";
  task_id: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "taskFinished".
 */
export interface TaskFinished {
  type: "task_finished";
  task_id: string;
  outcome: "passed" | "failed" | "error";
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "runFinished".
 */
export interface RunFinished {
  type: "run_finished";
  outcome: "completed" | "failed" | "cancelled" | "abandoned";
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "conversationMessage".
 */
export interface ConversationMessage {
  type: "conversation_message";
  message_id: string;
  role: "user" | "assistant";
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "modelRequest".
 */
export interface ModelRequest {
  type: "model_request";
  request_id: string;
  model_id: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "modelResponseStarted".
 */
export interface ModelResponseStarted {
  type: "model_response_started";
  request_id: string;
  status: number;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "modelResponseFinished".
 */
export interface ModelResponseFinished {
  type: "model_response_finished";
  request_id: string;
  outcome: "completed" | "error";
  chunk_count: number;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "toolFinished".
 */
export interface ToolFinished {
  type: "tool_finished";
  call_id: string;
  outcome: "completed" | "error";
  tool_name: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "workspaceCheckpoint".
 */
export interface WorkspaceCheckpoint {
  type: "workspace_checkpoint";
  checkpoint_id: string;
  changed: boolean;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "executionError".
 */
export interface ExecutionError {
  type: "execution_error";
  component: string;
  code: string;
}
