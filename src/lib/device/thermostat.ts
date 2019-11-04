import { getParamValue } from "../rule";
import { Trigger } from "../convert_trigger";
import { Condition } from "../convert_condition";
import { Info } from "../rule";
import { Action } from "../rule";

export interface ThermostatTrigger extends Trigger {
  above?: number;
  below?: number;
}

export interface ThermostatCondition extends Condition {
  above?: number;
  below?: number;
}

export const TRIGGERS = {
  get_temperature: (info: Info) => {
    const trigger: ThermostatTrigger = {
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
          console.warn(
            "Unknown operator for filter",
            info.invocation!.selector.kind,
            info.invocation!.channel,
            filter
          );
      }
    }

    return trigger;
  }
};

export const CONDITIONS = {
  get_temperature: (info: Info) => {
    const condition: ThermostatCondition = {
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
          console.warn(
            "Unknown operator for filter",
            info.invocation!.selector.kind,
            info.invocation!.channel,
            filter
          );
      }
    }
    return condition;
  }
};

export const ACTIONS = {
  set_target_temperature: (action: Action) => {
    const { in_params } = action.invocation;

    return {
      platform: "device",
      domain: "climate",
      type: "target_temperature",
      temperature: getParamValue(in_params, "value"),
      entity_id: ""
    };
  }
};
