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
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("sensor");
    return {
      automation: { ...trigger, type: `turned_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders(["sensor", "binary_sensor"], "battery")
    };
  }
};

export const CONDITIONS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("sensor");
    return {
      automation: { ...condition, type: `is_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders(["sensor", "binary_sensor"], "battery")
    };
  }
};
