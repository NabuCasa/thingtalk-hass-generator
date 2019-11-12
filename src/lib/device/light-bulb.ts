import { getParamValue, Action, Info } from "../rule";
import { getDeviceTriggerTemplate, DeviceTriggerConfig } from "../convert_trigger";
import { getDeviceActionTemplate, DeviceActionConfig } from "../convert_action";
import { getFilterValue, Placeholders, getDevicePlaceholders } from "../convert";
import { getDeviceConditionTemplate, DeviceConditionConfig } from "../convert_condition";
import { Context } from "../context";

export const TRIGGERS = {
  power: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("light");
    return {
      automation: { ...trigger, type: `turned_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders("light")
    };
  }
};

export const CONDITIONS = {
  power: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("light");
    return {
      automation: { ...condition, type: `is_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders("light")
    };
  }
};

export const ACTIONS = {
  set_power: (
    action: Action,
    context: Context
  ): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { in_params } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("light"),
        type: getParamValue(in_params, "power", action, context) == "on" ? "turn_on" : "turn_off"
      },
      placeholders: getDevicePlaceholders("light")
    };
  }
};
