import { Info } from "../rule";
import { getFilterValue, Placeholders, getDevicePlaceholders } from "../convert";
import { Context } from "../context";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholder: Placeholders } => {
    const trigger = getDeviceTriggerTemplate("binary_sensor");
    const placeholder = getDevicePlaceholders("binary_sensor", info.invocation?.selector);
    switch (getFilterValue(info, context)) {
      case "hot":
        trigger.type = "hot";
        placeholder.device_classes = ["heat"];
        break;
      case "cold":
        trigger.type = "cold";
        placeholder.device_classes = ["cold"];
        break;
      case "normal":
        placeholder.device_classes = ["cold", "heat"];
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
      case "hot":
        condition.type = "is_hot";
        placeholder.device_classes = ["heat"];
        break;
      case "cold":
        condition.type = "is_cold";
        placeholder.device_classes = ["cold"];
        break;
      case "normal":
        placeholder.device_classes = ["heat", "cold"];
        break;
      default:
    }
    return {
      automation: condition,
      placeholder
    };
  }
};
