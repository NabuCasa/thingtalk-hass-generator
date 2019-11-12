import { getTableInfo, Rule } from "./rule";
import { DeviceConfig, DeviceRangeConfig } from "./convert";
import { Context, addWarning } from "./context";

export interface DeviceConditionConfig extends DeviceRangeConfig {
  condition: string;
}

export const getDeviceConditionTemplate = (domain: string): DeviceConditionConfig => {
  return {
    condition: "device",
    domain,
    entity_id: "",
    device_id: ""
  };
};

export const convertCondition = async (rule: Rule, context: Context) => {
  // Process the filter on the expression
  // This becomes the condition.
  if (!rule.table) {
    return;
  }

  const info = getTableInfo(rule.table);
  info.part = "condition";

  if (!info.invocation) {
    return;
  }

  const kind = info.invocation.selector!.kind;
  const channel = info.invocation.channel;

  let kindPackage;

  try {
    kindPackage = await import(`./device/${kind}`);
  } catch (err) {
    addWarning(context, { part: "condition", warning: "unknown kind", kind });
    return;
  }

  if (!kindPackage.CONDITIONS) {
    addWarning(context, { part: "condition", warning: "part not supported", kind });
    return;
  }

  const channelFunc = kindPackage.CONDITIONS[channel!];

  if (!channelFunc) {
    addWarning(context, {
      part: "condition",
      warning: "unknown channel",
      kind,
      channel
    });
    return;
  }

  const condition = channelFunc(info, context);

  if (!condition) {
    // Assume condition already warned.
    return;
  }

  return { automation: condition.automation, placeholders: condition.placeholders };
};
