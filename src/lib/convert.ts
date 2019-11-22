import { convertTrigger, DeviceTriggerConfig } from "./convert_trigger";
import { convertCondition, DeviceConditionConfig } from "./convert_condition";
import { convertAction } from "./convert_action";
import { Rule, Info, Selector } from "./rule";
import { Context, addWarning } from "./context";

export interface AutomationConfig {
  alias?: string;
  description?: string;
  trigger?: any[];
  condition?: any[];
  action?: any[];
}

export interface AutomationPlaceholders {
  trigger?: any[];
  condition?: any[];
  action?: any[];
}

export interface DeviceConfig {
  entity_id?: string;
  domain?: string;
  device_id?: string;
  type?: string;
}

export interface DeviceRangeConfig extends DeviceConfig {
  above?: string | number;
  below?: string | number;
}

export interface Placeholders {
  index?: number;
  fields: string[];
  domains: string[];
  device_classes?: string[];
  name?: string;
}

export const getDevicePlaceholders = (
  domains: string | string[],
  selector?: Selector,
  deviceClasses?: string | string[]
): Placeholders => {
  const placeholder: Placeholders = {
    fields: ["device_id", "entity_id"],
    domains: typeof domains === "string" ? [domains] : domains
  };
  if (deviceClasses) {
    placeholder.device_classes =
      typeof deviceClasses === "string" ? [deviceClasses] : deviceClasses;
  }
  if (selector) {
    let deviceName: string | undefined;
    if (selector && selector.attributes) {
      selector.attributes.forEach(attribute => {
        if (attribute.name === "name") {
          deviceName = attribute.value.value;
        }
      });
    }
    if (deviceName) {
      placeholder.name = deviceName;
    }
  }
  return placeholder;
};

export const getFilterRangeConfig = <T extends DeviceRangeConfig>(
  config: T,
  info: Info,
  context: Context
): T => {
  for (const filter of info.filters) {
    config = getFilterRangeValue(config, filter, info, context);
  }
  return config;
};

export const getFilterRangeValue = (config, filter, info, context) => {
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
  const placeholders: AutomationPlaceholders = {};

  const trigger = await convertTrigger(rule, context);
  const condition = await convertCondition(rule, context);
  const action = await convertAction(rule, context);

  if (trigger) {
    automation.trigger = [trigger.automation];
    if (trigger.placeholders) {
      placeholders.trigger = [{ index: 0, ...trigger.placeholders }];
    }
  }
  if (condition) {
    automation.condition = [condition.automation];
    if (condition.placeholders) {
      placeholders.condition = [{ index: 0, ...condition.placeholders }];
    }
  }
  if (action) {
    automation.action = action.automation;
    if (action.placeholders) {
      placeholders.action = action.placeholders;
    }
  }

  return { automation, placeholders };
};
