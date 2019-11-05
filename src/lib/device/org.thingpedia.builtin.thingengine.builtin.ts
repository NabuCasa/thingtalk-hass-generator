import { Info } from "../rule";
import { getFilterValue } from "../convert";

export interface ZoneTrigger {
  platform: "zone";
  zone?: string;
  event?: "leave" | "enter";
  entity_id: string;
}

export interface ZoneCondition {
  condition: "zone";
  zone?: string;
  entity_id: string;
}

export const TRIGGERS = {
  get_gps: (info: Info): ZoneTrigger => {
    const trigger: ZoneTrigger = {
      platform: "zone",
      entity_id: ""
    };

    for (const filter of info.filters) {
      const filterExpr = filter.expr || filter;
      switch (filterExpr.operator) {
        case "==":
          trigger.zone = `zone.${filterExpr.value!.value.relativeTag}`;
          trigger.event = filter.isNot ? "leave" : "enter";
          break;

        default:
          console.warn(
            "Unknown operator for filter",
            info.invocation!.selector!.kind,
            info.invocation!.channel,
            filterExpr
          );
      }
    }
    return trigger;
  }
};

export const CONDITIONS = {
  get_gps: (info: Info): ZoneCondition => {
    return {
      condition: "zone",
      entity_id: "",
      zone: `zone.${getFilterValue(info).relativeTag}`
    };
  }
};
