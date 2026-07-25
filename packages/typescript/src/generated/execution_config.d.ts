/* Generated from JSON Schema. Do not edit. */

export interface ExecutionConfiguration {
  protocol_version: "0.1.0";
  config_id: string;
  model: {
    provider: string;
    model: string;
    revision?: string;
    parameters_digest: string;
  };
  agent: {
    name: string;
    version: string;
    config_digest: string;
  };
  environment: {
    image_digest: string;
  };
}
