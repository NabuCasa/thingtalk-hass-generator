"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRIGGERS = {
    get_gps: (info) => {
        const trigger = {
            platform: "zone",
            entity_id: ""
        };
        debugger;
        for (const filter of info.filters) {
            // if the thinktalk includes `not` we are getting the filter in filter.expr but I don't see anywhere that it should not be this location?
            const filterExpr = filter.expr || filter;
            switch (filterExpr.operator) {
                case "==":
                    trigger.zone = `zone.${filterExpr.value.value.relativeTag}`;
                    break;
                default:
                    console.warn("Unknown operator for filter", info.invocation.selector.kind, info.invocation.channel, filterExpr);
            }
        }
        return trigger;
    }
};
//# sourceMappingURL=org.thingpedia.builtin.thingengine.builtin.js.map