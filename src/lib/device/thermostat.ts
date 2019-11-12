import { getParamValue } from "../rule";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { Info } from "../rule";
import { Action } from "../rule";
import { getDeviceActionTemplate, DeviceActionConfig } from "../convert_action";
import {
  getFilterRangeConfig,
  getFilterValue,
  Placeholders,
  getDevicePlaceholders
} from "../convert";
import { Context } from "../context";

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
  get_temperature: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = {
      ...getDeviceTriggerTemplate("climate"),
      type: "current_temperature_changed"
    };
    return {
      automation: getFilterRangeConfig(trigger, info, context) as DeviceTriggerConfig,
      placeholders: getDevicePlaceholders("climate")
    };
  },
  get_humidity: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    const trigger: DeviceTriggerConfig = {
      ...getDeviceTriggerTemplate("climate"),
      type: "current_humidity_changed"
    };
    return {
      automation: getFilterRangeConfig(trigger, info, context) as DeviceTriggerConfig,
      placeholders: getDevicePlaceholders("climate")
    };
  },
  get_hvac_state: (
    info: Info,
    context: Context
  ): { automation: DeviceTriggerConfig; placeholders: Placeholders } => {
    return {
      automation: {
        ...getDeviceTriggerTemplate("climate"),
        type: "hvac_mode_changed",
        to: getFilterValue(info, context)
      },
      placeholders: getDevicePlaceholders("climate")
    };
  }
};

export const CONDITIONS = {
  get_temperature: (
    info: Info,
    context: Context
  ): { automation: ThermostatCondition; placeholders: Placeholders } => {
    const condition: ThermostatCondition = {
      ...getDeviceConditionTemplate("climate"),
      type: "is_current_temperature"
    };
    return {
      automation: getFilterRangeConfig(condition, info, context),
      placeholders: getDevicePlaceholders("climate")
    };
  },
  get_humidity: (
    info: Info,
    context: Context
  ): { automation: ThermostatCondition; placeholders: Placeholders } => {
    const condition: ThermostatCondition = {
      ...getDeviceConditionTemplate("climate"),
      type: "is_current_humidity"
    };
    return {
      automation: getFilterRangeConfig(condition, info, context),
      placeholders: getDevicePlaceholders("climate")
    };
  },
  get_hvac_state: (
    info: Info,
    context: Context
  ): { automation: ThermostatCondition; placeholders: Placeholders } => {
    return {
      automation: {
        ...getDeviceConditionTemplate("climate"),
        type: "is_hvac_mode",
        hvac_mode: getFilterValue(info, context)
      },
      placeholders: getDevicePlaceholders("climate")
    };
  }
};

export const ACTIONS = {
  set_target_temperature: (
    action: Action,
    context: Context
  ): { automation: ThermostatTemperatureAction; placeholders: Placeholders } => {
    const { in_params } = action.invocation;

    return {
      automation: {
        ...getDeviceActionTemplate("climate"),
        type: "set_target_temperature",
        temperature: getParamValue(in_params, "value", action, context)
      },
      placeholders: getDevicePlaceholders("climate")
    };
  },
  set_minmax_temperature: (
    action: Action,
    context: Context
  ): { automation: ThermostatTemperatureAction; placeholders: Placeholders } => {
    const { in_params } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("climate"),
        type: "set_target_temperature",
        min_temperature: getParamValue(in_params, "low", action, context),
        max_temperature: getParamValue(in_params, "high", action, context)
      },
      placeholders: getDevicePlaceholders("climate")
    };
  },
  set_hvac_mode: (
    action: Action,
    context: Context
  ): { automation: ThermostatHvacModeAction; placeholders: Placeholders } => {
    const { in_params } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("climate"),
        type: "set_hvac_mode",
        hvac_mode: getParamValue(in_params, "mode", action, context)
      },
      placeholders: getDevicePlaceholders("climate")
    };
  }
};
