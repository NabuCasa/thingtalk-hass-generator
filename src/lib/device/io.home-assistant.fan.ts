import { getParamValue, Action, Info } from "../rule";
import { getDeviceTriggerTemplate, DeviceTriggerConfig } from "../convert_trigger";
import { getDeviceActionTemplate, DeviceActionConfig } from "../convert_action";
import { getFilterValue, Placeholders, getDevicePlaceholders } from "../convert";
import { getDeviceConditionTemplate, DeviceConditionConfig } from "../convert_condition";
import { Context } from "../context";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("fan");
    return {
      automation: { ...trigger, type: `turned_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders("fan", info.invocation?.selector)
    };
  },
  // no device automation for this yet
  oscillation: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("fan");
    return {
      automation: { ...trigger, type: `turned_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders("fan", info.invocation?.selector)
    };
  }
};

export const CONDITIONS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("fan");
    return {
      automation: { ...condition, type: `is_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders("fan", info.invocation?.selector)
    };
  },
  // no device automation for this yet
  oscillation: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("fan");
    return {
      automation: { ...condition, type: `is_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders("fan", info.invocation?.selector)
    };
  }
};

export const ACTIONS = {
  set_power: (
    action: Action,
    context: Context
  ): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { in_params, selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("fan"),
        type: getParamValue(in_params, "power", action, context) == "on" ? "turn_on" : "turn_off"
      },
      placeholders: getDevicePlaceholders("fan", selector)
    };
  },
  // no device automation for this yet
  set_oscillation: (
    action: Action,
    context: Context
  ): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { in_params, selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("fan"),
        type:
          getParamValue(in_params, "oscillation", action, context) == "on" ? "turn_on" : "turn_off"
      },
      placeholders: getDevicePlaceholders("fan", selector)
    };
  }
};
