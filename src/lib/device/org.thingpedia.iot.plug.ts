import { Info } from "../rule";
import { getDeviceTriggerTemplate, DeviceTriggerConfig } from "../convert_trigger";
import { getFilterValue, Placeholders, getDevicePlaceholders } from "../convert";
import { getDeviceConditionTemplate, DeviceConditionConfig } from "../convert_condition";
import { Context } from "../context";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("binary_sensor");
    return {
      automation: {
        ...trigger,
        type: getFilterValue(info, context) === "plugged" ? "plugged_in" : "not_plugged_in"
      },
      placeholders: getDevicePlaceholders("binary_sensor", info.invocation?.selector, "plug")
    };
  }
};

export const CONDITIONS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("binary_sensor");
    return {
      automation: {
        ...condition,
        type: getFilterValue(info, context) === "plugged" ? "is_plugged_in" : "is_not_plugged_in"
      },
      placeholders: getDevicePlaceholders("binary_sensor", info.invocation?.selector, "plug")
    };
  }
};
