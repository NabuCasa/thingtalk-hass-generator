import { Rule } from "./rule";

export const convertAction = async (rule: Rule) => {
  // Process the action
  if (!rule.actions) {
    return;
  }

  const actions: any[] = [];

  for (const action of rule.actions) {
    const kind = action.invocation.selector.kind;
    const channel = action.invocation.channel;

    let kindPackage;

    try {
      kindPackage = await import(`./device/${kind}`);
    } catch (err) {
      console.warn(`Action: Unknown kind ${kind}`);
      continue;
    }

    if (!kindPackage.ACTIONS) {
      console.warn(`Action: Unsupported kind ${kind}`);
      return;
    }

    const channelFunc = kindPackage.ACTIONS[channel];

    if (!channelFunc) {
      console.warn(`Action: Unknown channel ${channel} for kind ${kind}`);
      continue;
    }

    const automationAction = channelFunc(action);

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
