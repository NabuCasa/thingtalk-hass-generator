import { Info, Action, getParamValue } from "../rule";
import { getDeviceTriggerTemplate, DeviceTriggerConfig } from "../convert_trigger";
import { getFilterValue, Placeholders, getDevicePlaceholders } from "../convert";
import { getDeviceConditionTemplate, DeviceConditionConfig } from "../convert_condition";
import { Context } from "../context";
import { DeviceActionConfig, getDeviceActionTemplate } from "../convert_action";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = getDeviceTriggerTemplate("cover");
    return {
      automation: {
        ...trigger,
        type: getFilterValue(info, context) === "open" ? "opened" : "closed"
      },
      placeholders: getDevicePlaceholders("cover")
    };
  }
};

export const CONDITIONS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    const condition: DeviceConditionConfig = getDeviceConditionTemplate("cover");
    return {
      automation: {
        ...condition,
        type: getFilterValue(info, context) === "open" ? "is_open" : "is_closed"
      },
      placeholders: getDevicePlaceholders("cover")
    };
  }
};

export const ACTIONS = {
  set_openclose: (
    action: Action,
    context: Context
  ): { automation: DeviceActionConfig; placeholders: Placeholders } => {
    const { in_params } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("cover"),
        type: getParamValue(in_params, "state", action, context)
      },
      placeholders: getDevicePlaceholders("cover")
    };
  }
};
