const { getTableInfo } = require("./rule");

module.exports.convertTrigger = (automation, rule) => {
  // Check for a trigger
  if (!rule.stream) {
    return;
  }

  // Gather stream info
  let stream = rule.stream;

  const info = {
    filters: []
  };

  while (stream) {
    const type = stream.constructor.className;

    if (stream.filter) {
      info.filters.push(stream.filter);
    }

    switch (type) {
      case "Monitor":
        const tableInfo = getTableInfo(stream.table);
        info.filters.push(...tableInfo.filters);
        if (tableInfo.invocation) {
          info.invocation = tableInfo.invocation;
        }
        break;

      case "EdgeFilter":
        // Nothing to do
        break;

      default:
        console.warn("Unknown type", type);
    }

    stream = stream.stream;
  }

  if (!info.invocation) {
    return;
  }

  // convert stream info to automation trigger
  const kind = info.invocation.selector.kind;
  const channel = info.invocation.channel;

  let kindPackage;

  try {
    kindPackage = require(`./device/${kind}`);
  } catch (err) {
    console.warn(`Trigger: Unknown kind ${kind}`);
    return;
  }

  const channelFunc = kindPackage.TRIGGERS[channel];

  if (!channel) {
    console.warn(`Trigger: Unknown channel ${channel} for kind ${kind}`);
    return;
  }

  const trigger = channelFunc(info);

  if (!trigger) {
    // Assume trigger already warned.
    return;
  }

  automation.trigger = trigger;
};
