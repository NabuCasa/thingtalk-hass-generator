import { Rule } from "./rule";
import { DeviceConfig } from "./convert";
import { addWarning, Context } from "./context";

export interface DeviceActionConfig extends DeviceConfig {}

export const getDeviceActionTemplate = (domain: string): DeviceActionConfig => {
  return {
    domain,
    entity_id: "",
    device_id: ""
  };
};

export const convertAction = async (rule: Rule, context: Context) => {
  // Process the action
  if (!rule.actions) {
    return;
  }

  const actions: any[] = [];

  for (const action of rule.actions) {
    const kind = action.invocation.selector!.kind;
    const channel = action.invocation.channel;
    action.part = "condition";

    let kindPackage;

    try {
      kindPackage = await import(`./device/${kind}`);
    } catch (err) {
      addWarning(context, { part: "action", warning: "unknown kind", kind });
      continue;
    }

    if (!kindPackage.ACTIONS) {
      addWarning(context, { part: "action", warning: "part not supported", kind });
      return;
    }

    const channelFunc = kindPackage.ACTIONS[channel!];

    if (!channelFunc) {
      addWarning(context, {
        part: "action",
        warning: "unknown channel",
        kind,
        channel
      });
      continue;
    }

    const automationAction = channelFunc(action, context);

    if (!automationAction) {
      // Assume trigger already warned.
      continue;
    }

    actions.push(automationAction);
  }

  if (actions.length > 0) {
    return actions;
  }
};
