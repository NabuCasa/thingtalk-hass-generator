import { Context } from "../context";
import { getDevicePlaceholders, getFilterValue, Placeholders } from "../convert";
import { DeviceActionConfig, getDeviceActionTemplate } from "../convert_action";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Action, getParamValue, Info } from "../rule";

const DOMAIN = "light";

export const TRIGGERS = {
  power: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate(DOMAIN);
    return {
      automation: { ...trigger, type: `turned_${getFilterValue(info, context)}` },
      placeholders: getDevicePlaceholders(DOMAIN, info.invocation?.selector)
    };
  }
};

export const CONDITIONS = {
  power: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate(DOMAIN);
    return {
      automation: { ...condition, type: `is_${getFilterValue(info, context)}` },
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
        type: `turn_${getParamValue(in_params, "power", action, context)}`
      },
      placeholders: getDevicePlaceholders(DOMAIN, selector)
    };
  }
};
