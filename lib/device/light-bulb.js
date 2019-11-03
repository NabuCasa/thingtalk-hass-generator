const { getParamValue } = require("../rule");

module.exports.ACTIONS = {
  set_power: action => {
    const { in_params } = action.invocation;

    return {
      platform: "device",
      domain: "light",
      type: getParamValue(in_params, "power") == "on" ? "turn_on" : "turn_off",
      entity_id: ""
    };
  }
};
