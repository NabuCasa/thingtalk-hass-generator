import { getTableInfo, Rule, Info, Stream } from "./rule";
import { DeviceConfig } from "./convert";

export interface DeviceTriggerConfig extends DeviceConfig {
  to?: string;
}

export const getDeviceTriggerTemplate = (domain: string): DeviceTriggerConfig => {
  return {
    platform: "device",
    domain: domain,
    entity_id: "",
    device_id: ""
  };
};

export const convertTrigger = async (rule: Rule) => {
  // Check for a trigger
  if (!rule.stream) {
    return;
  }

  // Gather stream info
  let stream: Stream | undefined = rule.stream;

  const info: Info = {
    filters: []
  };

  while (stream) {
    // @ts-ignore
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
  const kind = info.invocation.selector!.kind;
  const channel = info.invocation.channel;

  let kindPackage;

  try {
    kindPackage = await import(`./device/${kind}`);
  } catch (err) {
    console.warn(`Trigger: Unknown kind ${kind}`);
    return;
  }

  if (!kindPackage.TRIGGERS) {
    console.warn(`Trigger: Unsupported kind ${kind}`);
    return;
  }

  const channelFunc = kindPackage.TRIGGERS[channel!];

  if (!channelFunc) {
    console.warn(`Trigger: Unknown channel ${channel} for kind ${kind}`);
    return;
  }

  const trigger = channelFunc(info);

  if (!trigger) {
    // Assume trigger already warned.
    return;
  }

  return trigger;
};
