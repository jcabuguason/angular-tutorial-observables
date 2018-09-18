export interface InstanceInfo {
  uri: string;
  display_elements: InstanceNames;
}

export interface InstanceNames {
  en: string[];
  fr: string[];
}

export interface InstanceResponse {
  instances: InstanceInfo[];
  total_instances: number;
}
