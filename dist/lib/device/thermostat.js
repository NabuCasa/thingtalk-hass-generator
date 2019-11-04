"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule_1 = require("../rule");
exports.TRIGGERS = {
    get_temperature: (info) => {
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
                    console.warn("Unknown operator for filter", info.invocation.selector.kind, info.invocation.channel, filter);
            }
        }
        return trigger;
    }
};
exports.CONDITIONS = {
    get_temperature: (info) => {
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
                    console.warn("Unknown operator for filter", info.invocation.selector.kind, info.invocation.channel, filter);
            }
        }
        return condition;
    }
};
exports.ACTIONS = {
    set_target_temperature: (action) => {
        const { in_params } = action.invocation;
        return {
            platform: "device",
            domain: "climate",
            type: "target_temperature",
            temperature: rule_1.getParamValue(in_params, "value"),
            entity_id: ""
        };
    }
};
//# sourceMappingURL=thermostat.js.map