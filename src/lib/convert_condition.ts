import { getTableInfo, Rule } from "./rule";
import { DeviceConfig } from "./convert";

export interface DeviceConditionConfig extends DeviceConfig {}

export const getDeviceConditionTemplate = (domain: string): DeviceConditionConfig => {
  return {
    platform: "device",
    domain: domain,
    entity_id: "",
    device_id: ""
  };
};

export const convertCondition = async (rule: Rule) => {
  // Process the filter on the expression
  // This becomes the condition.
  if (!rule.table) {
    return;
  }

  const info = getTableInfo(rule.table);

  if (!info.invocation) {
    return;
  }

  const kind = info.invocation.selector!.kind;
  const channel = info.invocation.channel;

  let kindPackage;

  try {
    kindPackage = await import(`./device/${kind}`);
  } catch (err) {
    console.warn(`Condition: Unknown kind ${kind}`);
    return;
  }

  if (!kindPackage.CONDITIONS) {
    console.warn(`Condition: Unsupported kind ${kind}`);
    return;
  }

  const channelFunc = kindPackage.CONDITIONS[channel!];

  if (!channelFunc) {
    console.warn(`Condition: Unknown channel ${channel} for kind ${kind}`);
    return;
  }

  const condition = channelFunc(info);

  if (!condition) {
    // Assume condition already warned.
    return;
  }

  return condition;
};
