/* Generated from JSON Schema. Do not edit. */

export interface ExecutionConfiguration {
  protocol_version: "0.6.0";
  config_id: string;
  images: {
    environment: Image;
    execution: Image;
    gateway: Image;
    evaluator?: Image;
  };
  harness: {
    id: string;
    version: string;
    artifact:
      | {
          digest: string;
        }
      | {
          package_integrity: string;
        };
  };
  adapter: {
    contract: string;
    implementation_version: string;
  };
  model: {
    provider: string;
    model_id: string;
    revision?: string;
    parameters_digest: string;
    presented_route: ModelRoute;
    upstream_route: ModelRoute;
  };
}
/**
 * This interface was referenced by `ExecutionConfiguration`'s JSON-Schema
 * via the `definition` "image".
 */
export interface Image {
  digest: string;
}
/**
 * This interface was referenced by `ExecutionConfiguration`'s JSON-Schema
 * via the `definition` "modelRoute".
 */
export interface ModelRoute {
  protocol: "openai-chat-completions" | "openai-responses" | "anthropic-messages";
  model_id: string;
}
