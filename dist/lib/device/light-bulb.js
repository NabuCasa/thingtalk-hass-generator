"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rule_1 = require("../rule");
exports.ACTIONS = {
    set_power: (action) => {
        const { in_params } = action.invocation;
        return {
            platform: "device",
            domain: "light",
            type: rule_1.getParamValue(in_params, "power") == "on" ? "turn_on" : "turn_off",
            entity_id: ""
        };
    }
};
exports.TRIGGERS = {
    power: (info) => {
        const trigger = {
            platform: "light",
            entity_id: ""
        };
        for (const filter of info.filters) {
            // if the thinktalk includes `not` we are getting the filter in filter.expr but I don't see anywhere that it should not be this location?
            const filterExpr = filter.expr || filter;
            switch (filterExpr.operator) {
                case "==":
                    trigger.state = filterExpr.value.value;
                    break;
                default:
                    console.warn("Unknown operator for filter", info.invocation.selector.kind, info.invocation.channel, filterExpr);
            }
        }
        return trigger;
    }
};
//# sourceMappingURL=light-bulb.js.map