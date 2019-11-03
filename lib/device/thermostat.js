module.exports.TRIGGERS = {
  get_temperature: info => {
    const trigger = {
      platform: "device",
      entity_id: "",
      domain: "climate",
      type: "current_temperature"
    };

    for (const filter of info.filters) {
      switch (filter.operator) {
        case ">=":
          // TODO compare to unit. filter.value.unit == C/F
          trigger.above = filter.value.value;
          break;

        case "<=":
          // TODO compare to unit. filter.value.unit == C/F
          trigger.below = filter.value.value;
          break;

        default:
          console.warn("Unknown operator for filter", kind, channel, filter);
      }
    }

    return trigger;
  }
};

module.exports.CONDITIONS = {
  get_temperature: info => {
    const condition = {
      device_id: "",
      domain: "climate",
      type: "current_temperature"
    };

    for (const filter of info.filters) {
      switch (filter.operator) {
        case ">=":
          // TODO compare to unit. filter.value.unit == C/F
          condition.above = filter.value.value;
          break;

        case "<=":
          // TODO compare to unit. filter.value.unit == C/F
          condition.below = filter.value.value;
          break;

        default:
          console.warn("Unknown operator for filter", kind, channel, filter);
      }
    }
    return condition;
  }
};
