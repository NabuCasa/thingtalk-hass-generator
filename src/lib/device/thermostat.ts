import { getParamValue } from "../rule";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { Info } from "../rule";
import { Action } from "../rule";
import { getDeviceActionTemplate, DeviceActionConfig } from "../convert_action";
import { getFilterRangeConfig, getFilterValue } from "../convert";

export interface ThermostatTrigger extends DeviceTriggerConfig {}

export interface ThermostatCondition extends DeviceConditionConfig {
  hvac_mode?: string;
}

export interface ThermostatTemperatureAction extends DeviceActionConfig {
  temperature?: string;
  min_temperature?: string;
  max_temperature?: string;
}

export interface ThermostatHvacModeAction extends DeviceActionConfig {
  hvac_mode?: string;
}

export const TRIGGERS = {
  get_temperature: (info: Info): ThermostatTrigger => {
    const trigger: ThermostatTrigger = {
      ...getDeviceTriggerTemplate("climate"),
      type: "current_temperature_changed"
    };
    return getFilterRangeConfig(trigger, info);
  },
  get_humidity: (info: Info): ThermostatTrigger => {
    const trigger: ThermostatTrigger = {
      ...getDeviceTriggerTemplate("climate"),
      type: "current_humidity_changed"
    };
    return getFilterRangeConfig(trigger, info);
  },
  get_hvac_state: (info: Info): ThermostatTrigger => {
    return {
      ...getDeviceTriggerTemplate("climate"),
      type: "hvac_mode_changed",
      to: getFilterValue(info)
    };
  }
};

export const CONDITIONS = {
  get_temperature: (info: Info): ThermostatCondition => {
    const condition: ThermostatCondition = {
      ...getDeviceConditionTemplate("climate"),
      type: "is_current_temperature"
    };
    return getFilterRangeConfig(condition, info);
  },
  get_humidity: (info: Info): ThermostatCondition => {
    const condition: ThermostatCondition = {
      ...getDeviceConditionTemplate("climate"),
      type: "is_current_humidity"
    };
    return getFilterRangeConfig(condition, info);
  },
  get_hvac_state: (info: Info): ThermostatCondition => {
    return {
      ...getDeviceConditionTemplate("climate"),
      type: "is_hvac_mode",
      hvac_mode: getFilterValue(info)
    };
  }
};

export const ACTIONS = {
  set_target_temperature: (action: Action): ThermostatTemperatureAction => {
    const { in_params } = action.invocation;

    return {
      ...getDeviceActionTemplate("climate"),
      type: "set_target_temperature",
      temperature: getParamValue(in_params, "value")
    };
  },
  set_minmax_temperature: (action: Action): ThermostatTemperatureAction => {
    const { in_params } = action.invocation;
    return {
      ...getDeviceActionTemplate("climate"),
      type: "set_target_temperature",
      min_temperature: getParamValue(in_params, "low"),
      max_temperature: getParamValue(in_params, "high")
    };
  },
  set_hvac_mode: (action: Action): ThermostatHvacModeAction => {
    const { in_params } = action.invocation;
    return {
      ...getDeviceActionTemplate("climate"),
      type: "set_hvac_mode",
      hvac_mode: getParamValue(in_params, "mode")
    };
  }
};
