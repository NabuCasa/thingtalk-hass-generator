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
    const placeholder = getDevicePlaceholders("binary_sensor", info.invocation?.selector);
    switch (getFilterValue(info, context)) {
      case "gas":
        trigger.type = "gas";
        placeholder.device_classes = ["gas"];
        break;
      case "smoke":
        trigger.type = "smoke";
        placeholder.device_classes = ["smoke"];
        break;
      case "nothing":
        placeholder.device_classes = ["gas", "smoke"];
        break;
      default:
    }
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
    const placeholder = getDevicePlaceholders("binary_sensor", info.invocation?.selector);
    switch (getFilterValue(info, context)) {
      case "gas":
        condition.type = "is_gas";
        placeholder.device_classes = ["gas"];
        break;
      case "smoke":
        condition.type = "is_smoke";
        placeholder.device_classes = ["smoke"];
        break;
      case "nothing":
        placeholder.device_classes = ["gas", "smoke"];
        break;
      default:
    }
    return {
      automation: condition,
      placeholder
    };
  }
};
