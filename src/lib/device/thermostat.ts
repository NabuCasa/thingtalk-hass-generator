import { getParamValue } from "../rule";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { Info } from "../rule";
import { Action } from "../rule";
import { getDeviceActionTemplate, DeviceActionConfig } from "../convert_action";
import { getFilterRangeConfig, getFilterValue } from "../convert";
import { Context } from "../context";

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
  get_temperature: (info: Info, context: Context): ThermostatTrigger => {
    const trigger: ThermostatTrigger = {
      ...getDeviceTriggerTemplate("climate"),
      type: "current_temperature_changed"
    };
    return getFilterRangeConfig(trigger, info, context);
  },
  get_humidity: (info: Info, context: Context): ThermostatTrigger => {
    const trigger: ThermostatTrigger = {
      ...getDeviceTriggerTemplate("climate"),
      type: "current_humidity_changed"
    };
    return getFilterRangeConfig(trigger, info, context);
  },
  get_hvac_state: (info: Info, context: Context): ThermostatTrigger => {
    return {
      ...getDeviceTriggerTemplate("climate"),
      type: "hvac_mode_changed",
      to: getFilterValue(info, context)
    };
  }
};

export const CONDITIONS = {
  get_temperature: (info: Info, context: Context): ThermostatCondition => {
    const condition: ThermostatCondition = {
      ...getDeviceConditionTemplate("climate"),
      type: "is_current_temperature"
    };
    return getFilterRangeConfig(condition, info, context) as ThermostatCondition;
  },
  get_humidity: (info: Info, context: Context): ThermostatCondition => {
    const condition: ThermostatCondition = {
      ...getDeviceConditionTemplate("climate"),
      type: "is_current_humidity"
    };
    return getFilterRangeConfig(condition, info, context) as ThermostatCondition;
  },
  get_hvac_state: (info: Info, context: Context): ThermostatCondition => {
    return {
      ...getDeviceConditionTemplate("climate"),
      type: "is_hvac_mode",
      hvac_mode: getFilterValue(info, context)
    };
  }
};

export const ACTIONS = {
  set_target_temperature: (action: Action, context: Context): ThermostatTemperatureAction => {
    const { in_params } = action.invocation;

    return {
      ...getDeviceActionTemplate("climate"),
      type: "set_target_temperature",
      temperature: getParamValue(in_params, "value", action, context)
    };
  },
  set_minmax_temperature: (action: Action, context: Context): ThermostatTemperatureAction => {
    const { in_params } = action.invocation;
    return {
      ...getDeviceActionTemplate("climate"),
      type: "set_target_temperature",
      min_temperature: getParamValue(in_params, "low", action, context),
      max_temperature: getParamValue(in_params, "high", action, context)
    };
  },
  set_hvac_mode: (action: Action, context: Context): ThermostatHvacModeAction => {
    const { in_params } = action.invocation;
    return {
      ...getDeviceActionTemplate("climate"),
      type: "set_hvac_mode",
      hvac_mode: getParamValue(in_params, "mode", action, context)
    };
  }
};
