import { Context } from "../context";
import { getDevicePlaceholders, getFilterRangeConfig, Placeholders } from "../convert";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Info } from "../rule";
import { getDeviceConditionTemplate, DeviceConditionConfig } from "../convert_condition";

export const TRIGGERS = {
  temperature: (
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
  temperature: (
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
