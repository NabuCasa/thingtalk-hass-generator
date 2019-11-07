import { Info } from "../rule";
import { getFilterValue } from "../convert";
import { addWarning, Context } from "../context";

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
  get_gps: (info: Info, context: Context): ZoneTrigger => {
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
          addWarning(context, {
            part: "trigger",
            warning: "unknown operator for filter",
            kind: info.invocation!.selector!.kind,
            channel: info.invocation!.channel,
            value: filterExpr.toJSON
          });
      }
    }
    return trigger;
  }
};

export const CONDITIONS = {
  get_gps: (info: Info, context: Context): ZoneCondition => {
    return {
      condition: "zone",
      entity_id: "",
      zone: `zone.${getFilterValue(info, context).relativeTag}`
    };
  }
};
