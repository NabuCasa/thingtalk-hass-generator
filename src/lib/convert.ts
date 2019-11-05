import { convertTrigger } from "./convert_trigger";
import { convertCondition } from "./convert_condition";
import { convertAction } from "./convert_action";
import { Rule, Info } from "./rule";

// Import the devices so they are added to the build
import "./device/light-bulb";
import "./device/thermostat";
import "./device/org.thingpedia.builtin.thingengine.builtin";

export interface AutomationConfig {
  alias?: string;
  description?: string;
  trigger?: any[];
  condition?: any[];
  action?: any[];
  script?: any[];
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

export const getFilterRangeConfig = (config: DeviceConfig, info: Info) => {
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
        console.warn(
          "Unknown operator for filter",
          info.invocation!.selector!.kind,
          info.invocation!.channel,
          filter
        );
    }
  }
  return config;
};

export const getFilterValue = (info: Info) => {
  let value;
  for (const filter of info.filters) {
    const filterExpr = filter.expr || filter;
    switch (filterExpr.operator) {
      case "==":
        value = filterExpr.value!.value;
        break;

      default:
        console.warn(
          "Unknown operator for filter",
          info.invocation!.selector!.kind,
          info.invocation!.channel,
          filterExpr
        );
    }
  }
  return value;
};

export const convertRule = async (rule: Rule) => {
  const automation: AutomationConfig = {};

  const trigger = await convertTrigger(rule);
  const condition = await convertCondition(rule);
  const action = await convertAction(rule);

  if (trigger) {
    automation.trigger = [trigger];
  }
  if (condition) {
    automation.condition = condition;
  }
  if (action) {
    automation.action = action;
  }

  return automation;
};
