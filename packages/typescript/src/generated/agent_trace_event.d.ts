/* Generated from JSON Schema. Do not edit. */

export interface AgentTraceEvent {
  protocol_version: "0.6.0";
  run_id: string;
  sequence: number;
  event_id: string;
  profile: ProfileReference;
  producer: Producer;
  source: Source;
  context: Context;
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
    | AgentStarted
    | AgentFinished
    | WorkspaceRegistered
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
 * via the `definition` "context".
 */
export interface Context {
  agent_span_id: string | null;
  workspace_context_id: string | null;
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
  expected_coverage: ArtifactReference;
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
  achieved_coverage: ArtifactReference;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "agentStarted".
 */
export interface AgentStarted {
  type: "agent_started";
  agent_span_id: string;
  native_agent_id?: string;
  parent_agent_span_id?: string;
  native_parent_agent_id?: string;
  role: string;
  harness: HarnessIdentity;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "harnessIdentity".
 */
export interface HarnessIdentity {
  id: string;
  version: string;
  adapter_version: string;
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "agentFinished".
 */
export interface AgentFinished {
  type: "agent_finished";
  agent_span_id: string;
  outcome: "completed" | "failed" | "cancelled" | "unknown";
  warnings: string[];
}
/**
 * This interface was referenced by `AgentTraceEvent`'s JSON-Schema
 * via the `definition` "workspaceRegistered".
 */
export interface WorkspaceRegistered {
  type: "workspace_registered";
  workspace_context_id: string;
  display_alias: string;
  container_path: string;
  vcs?: {
    git_head?: string;
    worktree_id?: string;
    repository_fingerprint?: string;
  };
  capture: Capture;
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
