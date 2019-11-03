module.exports.convertAction = (automation, rule) => {
  // Process the action
  if (!rule.actions) {
    return;
  }

  const actions = [];

  for (const action of rule.actions) {
    const kind = action.invocation.selector.kind;
    const channel = action.invocation.channel;

    let kindPackage;

    try {
      kindPackage = require(`./device/${kind}`);
    } catch (err) {
      console.warn(`Action: Unknown kind ${kind}`);
      continue;
    }

    const channelFunc = kindPackage.ACTIONS[channel];

    if (!channel) {
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
    automation.action = actions;
  }
};
