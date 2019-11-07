import { getParamValue, Action, Info } from "../rule";
import { getDeviceTriggerTemplate, DeviceTriggerConfig } from "../convert_trigger";
import { getDeviceActionTemplate } from "../convert_action";
import { getFilterValue } from "../convert";
import { getDeviceConditionTemplate } from "../convert_condition";
import { Context } from "../context";

export interface LightTrigger extends DeviceTriggerConfig {
  state?: string;
}

export const TRIGGERS = {
  power: (info: Info, context: Context): LightTrigger => {
    const trigger: LightTrigger = getDeviceTriggerTemplate("light");
    return { ...trigger, type: `turned_${getFilterValue(info, context)}` };
  }
};

export const CONDITIONS = {
  power: (info: Info, context: Context): LightTrigger => {
    const condition: LightTrigger = getDeviceConditionTemplate("light");
    return { ...condition, type: `turned_${getFilterValue(info, context)}` };
  }
};

export const ACTIONS = {
  set_power: (action: Action, context: Context) => {
    const { in_params } = action.invocation;
    return {
      ...getDeviceActionTemplate("light"),
      type: getParamValue(in_params, "power", action, context) == "on" ? "turn_on" : "turn_off"
    };
  }
};
