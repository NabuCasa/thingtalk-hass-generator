import { Context } from "../context";
import { getDevicePlaceholders, getFilterValue, Placeholders } from "../convert";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Info } from "../rule";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholder: Placeholders } => {
    const trigger = getDeviceTriggerTemplate("binary_sensor");
    const placeholder = getDevicePlaceholders(
      "binary_sensor",
      info.invocation?.selector,
      "moisture"
    );
    trigger.type = getFilterValue(info, context);
    return {
      automation: trigger,
      placeholder
    };
  }
};

export const CONDITIONS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholder: Placeholders } => {
    const condition = getDeviceConditionTemplate("binary_sensor");
    const placeholder = getDevicePlaceholders(
      "binary_sensor",
      info.invocation?.selector,
      "moisture"
    );
    condition.type = getFilterValue(info, context);
    return {
      automation: condition,
      placeholder
    };
  }
};
