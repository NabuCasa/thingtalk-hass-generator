import { Info } from "../rule";
import { getDeviceTriggerTemplate, DeviceTriggerConfig } from "../convert_trigger";
import { getFilterValue, Placeholders, getDevicePlaceholders } from "../convert";
import { getDeviceConditionTemplate, DeviceConditionConfig } from "../convert_condition";
import { Context } from "../context";

export const TRIGGERS = {
  sound: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("binary_sensor");
    return {
      automation: {
        ...trigger,
        type: getFilterValue(info, context) === "detecting" ? "sound" : "no_sound"
      },
      placeholders: getDevicePlaceholders("binary_sensor", info.invocation?.selector, "sound")
    };
  }
};

export const CONDITIONS = {
  sound: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("binary_sensor");
    return {
      automation: {
        ...condition,
        type: getFilterValue(info, context) === "detecting" ? "is_sound" : "is_no_sound"
      },
      placeholders: getDevicePlaceholders("binary_sensor", info.invocation?.selector, "sound")
    };
  }
};
