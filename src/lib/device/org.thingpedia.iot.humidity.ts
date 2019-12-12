import { Context } from "../context";
import { getDevicePlaceholders, getFilterRangeConfig, Placeholders } from "../convert";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Info } from "../rule";

export const TRIGGERS = {
  humidity: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = {
      ...getDeviceTriggerTemplate("sensor"),
      type: "humidity"
    };
    return {
      automation: getFilterRangeConfig(trigger, info, context) as DeviceTriggerConfig,
      placeholders: getDevicePlaceholders("sensor", info.invocation?.selector, "humidity")
    };
  }
};

export const CONDITIONS = {
  humidity: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = {
      ...getDeviceConditionTemplate("sensor"),
      type: "humidity"
    };
    return {
      automation: getFilterRangeConfig(condition, info, context) as DeviceConditionConfig,
      placeholders: getDevicePlaceholders("sensor", info.invocation?.selector, "humidity")
    };
  }
};
