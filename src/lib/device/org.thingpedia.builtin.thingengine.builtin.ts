import { Info } from "../rule";
import { getFilterValue, Placeholders } from "../convert";
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

const ZonePlaceholders = { fields: ["entity_id"], domains: ["person"] };

export const TRIGGERS = {
  get_gps: (
    info: Info,
    context: Context
  ): { automation: ZoneTrigger; placeholders: Placeholders } => {
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
    return { automation: trigger, placeholders: ZonePlaceholders };
  }
};

export const CONDITIONS = {
  get_gps: (
    info: Info,
    context: Context
  ): { automation: ZoneCondition; placeholders: Placeholders } => {
    return {
      automation: {
        condition: "zone",
        entity_id: "",
        zone: `zone.${getFilterValue(info, context).relativeTag}`
      },
      placeholders: ZonePlaceholders
    };
  }
};
