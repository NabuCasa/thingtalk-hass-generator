import { convertTrigger } from "./convert_trigger";
import { convertCondition } from "./convert_condition";
import { convertAction } from "./convert_action";
import { Rule } from "./rule";

export interface AutomationConfig {
  alias?: string;
  description?: string;
  trigger?: any[];
  condition?: any[];
  action?: any[];
  script?: any[];
}

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
