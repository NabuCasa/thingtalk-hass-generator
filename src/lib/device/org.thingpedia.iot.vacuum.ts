import { Info, Action, getParamValue } from "../rule";
import { getDeviceTriggerTemplate, DeviceTriggerConfig } from "../convert_trigger";
import { getFilterValue, Placeholders, getDevicePlaceholders } from "../convert";
import { getDeviceConditionTemplate, DeviceConditionConfig } from "../convert_condition";
import { Context } from "../context";
import { DeviceActionConfig, getDeviceActionTemplate } from "../convert_action";

const DOMAIN = "vacuum";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate(DOMAIN);
    return {
      automation: {
        ...trigger,
        // No device automation yet for off (on,off,docked)
        type: getFilterValue(info, context) === "on" ? "cleaning" : "docked"
      },
      placeholders: getDevicePlaceholders(DOMAIN, info.invocation?.selector)
    };
  }
};

export const CONDITIONS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate(DOMAIN);
    return {
      automation: {
        ...condition,
        // No device automation yet for off (on,off,docked)
        type: getFilterValue(info, context) === "on" ? "is_cleaning" : "is_docked"
      },
      placeholders: getDevicePlaceholders(DOMAIN, info.invocation?.selector)
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
        ...getDeviceActionTemplate(DOMAIN),
        type: getParamValue(in_params, "power", action, context) === "on" ? "clean" : "dock"
      },
      placeholders: getDevicePlaceholders(DOMAIN, selector)
    };
  },
  return_to_base: (
    action: Action
  ): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate(DOMAIN),
        type: "dock"
      },
      placeholders: getDevicePlaceholders(DOMAIN, selector)
    };
  },
  start: (action: Action): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate(DOMAIN),
        type: "clean"
      },
      placeholders: getDevicePlaceholders(DOMAIN, selector)
    };
  },
  // No device automation yet
  pause: (action: Action): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate(DOMAIN),
        type: "dock"
      },
      placeholders: getDevicePlaceholders(DOMAIN, selector)
    };
  },
  // No device automation yet
  stop: (action: Action): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate(DOMAIN),
        type: "dock"
      },
      placeholders: getDevicePlaceholders(DOMAIN, selector)
    };
  }
};
