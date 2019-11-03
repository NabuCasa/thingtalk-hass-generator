module.exports.TRIGGERS = {
  get_gps: info => {
    const trigger = {
      platform: "zone",
      entity_id: ""
    };

    for (const filter of info.filters) {
      switch (filter.operator) {
        case "==":
          trigger.zone = `zone.${filter.value.value.relativeTag}`;
          break;

        default:
          console.warn("Unknown operator for filter", kind, channel, filter);
      }
    }
    return trigger;
  }
};
