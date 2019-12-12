import { Context } from "../context";
import { getDevicePlaceholders, getFilterValue, Placeholders } from "../convert";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Info } from "../rule";

export const TRIGGERS = {
  motion: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("binary_sensor");
    return {
      automation: {
        ...trigger,
        type: getFilterValue(info, context) === "detecting" ? "motion" : "no_motion"
      },
      placeholders: getDevicePlaceholders("binary_sensor", info.invocation?.selector, "motion")
    };
  }
};

export const CONDITIONS = {
  motion: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("binary_sensor");
    return {
      automation: {
        ...condition,
        type: getFilterValue(info, context) === "detecting" ? "is_motion" : "is_no_motion"
      },
      placeholders: getDevicePlaceholders("binary_sensor", info.invocation?.selector, "motion")
    };
  }
};
