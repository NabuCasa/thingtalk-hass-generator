import { addWarning, Context } from "../context";
import { getDevicePlaceholders, getFilterRangeValue, Placeholders } from "../convert";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Info } from "../rule";

export const TRIGGERS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    let trigger: DeviceTriggerConfig;
    const placeholders: Placeholders = getDevicePlaceholders(
      "",
      info.invocation!.selector,
      "battery"
    );
    for (const filter of info.filters) {
      const filterExpr = filter.expr || filter;
      switch (filterExpr.name) {
        case "state":
          trigger = getDeviceTriggerTemplate("binary_sensor");
          placeholders.domains = ["binary_sensor"];
          switch (filterExpr.operator) {
            case "==":
              if (filterExpr.value!.value === "low") {
                trigger.type = "bat_low";
              } else {
                trigger.type = "not_bat_low";
              }
              break;

            default:
              addWarning(context, {
                channel: info.invocation!.channel,
                kind: info.invocation!.selector!.kind,
                part: info.part!,
                value: filterExpr.toJSON,
                warning: "unknown operator for filter"
              });
          }
          break;
        case "value":
          trigger = {
            ...getDeviceTriggerTemplate("sensor"),
            type: "battery_level"
          };
          placeholders.domains = ["sensor"];
          trigger = getFilterRangeValue(trigger, filterExpr, info, context);
          break;
        default:
          addWarning(context, {
            channel: info.invocation!.channel,
            kind: info.invocation!.selector!.kind,
            part: info.part!,
            value: filterExpr.toJSON,
            warning: "unknown filter"
          });
      }
    }

    return { automation: trigger!, placeholders };
  }
};

export const CONDITIONS = {
  state: (
    info: Info,
    context: Context
  ): { automation: DeviceConditionConfig; placeholders: Placeholders } => {
    let condition: DeviceConditionConfig;
    const placeholders: Placeholders = getDevicePlaceholders(
      "",
      info.invocation!.selector,
      "battery"
    );
    for (const filter of info.filters) {
      const filterExpr = filter.expr || filter;
      switch (filterExpr.name) {
        case "state":
          condition = getDeviceConditionTemplate("binary_sensor");
          placeholders.domains = ["binary_sensor"];
          switch (filterExpr.operator) {
            case "==":
              if (filterExpr.value!.value === "low") {
                condition.type = "is_bat_low";
              } else {
                condition.type = "is_not_bat_low";
              }
              break;

            default:
              addWarning(context, {
                channel: info.invocation!.channel,
                kind: info.invocation!.selector!.kind,
                part: info.part!,
                value: filterExpr.toJSON,
                warning: "unknown operator for filter"
              });
          }
          break;
        case "value":
          condition = {
            ...getDeviceConditionTemplate("sensor"),
            type: "is_battery_level"
          };
          placeholders.domains = ["sensor"];
          condition = getFilterRangeValue(condition, filterExpr, info, context);
          break;
        default:
          addWarning(context, {
            channel: info.invocation!.channel,
            kind: info.invocation!.selector!.kind,
            part: info.part!,
            value: filterExpr.toJSON,
            warning: "unknown filter"
          });
      }
    }

    return { automation: condition!, placeholders };
  }
};
