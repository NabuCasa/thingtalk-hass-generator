import { Context } from "../context";
import {
  getDevicePlaceholders,
  getFilterRangeConfig,
  getFilterValue,
  Placeholders
} from "../convert";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Info } from "../rule";

export interface SunTrigger {
  platform: "sun";
  event: "sunrise" | "sunset";
}

export interface SunCondition {
  condition: "sun";
  after?: "sunrise" | "sunset";
  before?: "sunrise" | "sunset";
}

export const TRIGGERS = {
  sunrise: (info: Info, context: Context): { automation: SunTrigger } => {
    return {
      automation: {
        platform: "sun",
        event: getFilterValue(info, context) ? "sunset" : "sunrise"
      }
    };
  },
  current: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = {
      ...getDeviceTriggerTemplate("sensor"),
      type: "temperature"
    };
    return {
      automation: getFilterRangeConfig(trigger, info, context) as DeviceTriggerConfig,
      placeholders: getDevicePlaceholders("sensor", info.invocation?.selector, "temperature")
    };
  }
};

export const CONDITIONS = {
  sunrise: (info: Info, context: Context): { automation: SunCondition } => {
    return {
      automation: {
        condition: "sun",
        after: getFilterValue(info, context) ? "sunset" : "sunrise"
      }
    };
  },
  current: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = {
      ...getDeviceConditionTemplate("sensor"),
      type: "temperature"
    };
    return {
      automation: getFilterRangeConfig(condition, info, context) as DeviceConditionConfig,
      placeholders: getDevicePlaceholders("sensor", info.invocation?.selector, "temperature")
    };
  }
};
