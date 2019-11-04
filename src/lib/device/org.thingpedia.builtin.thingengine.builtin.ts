import { Info } from "../rule";
import { Trigger } from "../convert_trigger";

export interface ZoneTrigger extends Trigger {
  zone?: string;
}

export const TRIGGERS = {
  get_gps: (info: Info) => {
    const trigger: ZoneTrigger = {
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
          console.warn(
            "Unknown operator for filter",
            info.invocation!.selector.kind,
            info.invocation!.channel,
            filterExpr
          );
      }
    }
    return trigger;
  }
};
