import { convertTrigger } from "./convert_trigger";
import { convertCondition } from "./convert_condition";
import { convertAction } from "./convert_action";
import { Rule, Info } from "./rule";
import { Context, addWarning } from "./context";

export interface AutomationConfig {
  alias?: string;
  description?: string;
  trigger?: any[];
  condition?: any[];
  action?: any[];
}

export interface DeviceConfig {
  platform?: string;
  entity_id?: string;
  domain?: string;
  device_id?: string;
  type?: string;
  above?: string | number;
  below?: string | number;
}

export const getFilterRangeConfig = (config: DeviceConfig, info: Info, context: Context) => {
  for (const filter of info.filters) {
    switch (filter.operator) {
      case ">=":
        config.above = filter.value!.value;
        break;

      case "==":
        config.above = Number(filter.value!.value) - 1;
        config.below = Number(filter.value!.value) + 1;
        break;

      case "<=":
        config.below = filter.value!.value;
        break;

      default:
        addWarning(context, {
          part: info.part!,
          warning: "unknown operator for filter",
          kind: info.invocation!.selector!.kind,
          channel: info.invocation!.channel,
          value: filter.toJSON
        });
    }
  }
  return config;
};

export const getFilterValue = (info: Info, context: Context) => {
  let value;
  for (const filter of info.filters) {
    const filterExpr = filter.expr || filter;
    switch (filterExpr.operator) {
      case "==":
        value = filterExpr.value!.value;
        break;

      default:
        addWarning(context, {
          part: info.part!,
          warning: "unknown operator for filter",
          kind: info.invocation!.selector!.kind,
          channel: info.invocation!.channel,
          value: filterExpr.toJSON
        });
    }
  }
  return value;
};

export const convertRule = async (rule: Rule, context: Context = {}) => {
  const automation: AutomationConfig = {};

  const trigger = await convertTrigger(rule, context);
  const condition = await convertCondition(rule, context);
  const action = await convertAction(rule, context);

  if (trigger) {
    automation.trigger = [trigger];
  }
  if (condition) {
    automation.condition = [condition];
  }
  if (action) {
    automation.action = action;
  }

  return { automation, context };
};
