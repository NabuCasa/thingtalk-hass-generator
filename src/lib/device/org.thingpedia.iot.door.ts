import { Context } from "../context";
import { getDevicePlaceholders, getFilterValue, Placeholders } from "../convert";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Info } from "../rule";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("binary_sensor");
    return {
      automation: {
        ...trigger,
        type: getFilterValue(info, context) === "open" ? "opened" : "closed"
      },
      placeholders: getDevicePlaceholders(
        ["binary_sensor", "cover"],
        info.invocation!.selector,
        "door"
      )
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
        type: getFilterValue(info, context) === "open" ? "is_open" : "is_closed"
      },
      placeholders: getDevicePlaceholders(
        ["binary_sensor", "cover"],
        info.invocation!.selector,
        "door"
      )
    };
  }
};
