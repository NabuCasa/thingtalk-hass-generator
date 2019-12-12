import { Context } from "../context";
import {
  getDevicePlaceholders,
  getFilterRangeConfig,
  getFilterValue,
  Placeholders
} from "../convert";
import { DeviceActionConfig, getDeviceActionTemplate } from "../convert_action";
import { DeviceConditionConfig, getDeviceConditionTemplate } from "../convert_condition";
import { DeviceTriggerConfig, getDeviceTriggerTemplate } from "../convert_trigger";
import { Action, getParamValue, Info } from "../rule";

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
      placeholders: getDevicePlaceholders("climate", info.invocation?.selector)
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
      placeholders: getDevicePlaceholders("climate", info.invocation?.selector)
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
      placeholders: getDevicePlaceholders("climate", info.invocation?.selector)
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
      placeholders: getDevicePlaceholders("climate", info.invocation?.selector)
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
      placeholders: getDevicePlaceholders("climate", info.invocation?.selector)
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
      placeholders: getDevicePlaceholders("climate", info.invocation?.selector)
    };
  }
};

export const ACTIONS = {
  set_target_temperature: (
    action: Action,
    context: Context
  ): { automation: ThermostatTemperatureAction; placeholders: Placeholders } => {
    const { in_params, selector } = action.invocation;

    return {
      automation: {
        ...getDeviceActionTemplate("climate"),
        type: "set_target_temperature",
        temperature: getParamValue(in_params, "value", action, context)
      },
      placeholders: getDevicePlaceholders("climate", selector)
    };
  },
  set_minmax_temperature: (
    action: Action,
    context: Context
  ): { automation: ThermostatTemperatureAction; placeholders: Placeholders } => {
    const { in_params, selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("climate"),
        type: "set_target_temperature",
        min_temperature: getParamValue(in_params, "low", action, context),
        max_temperature: getParamValue(in_params, "high", action, context)
      },
      placeholders: getDevicePlaceholders("climate", selector)
    };
  },
  set_hvac_mode: (
    action: Action,
    context: Context
  ): { automation: ThermostatHvacModeAction; placeholders: Placeholders } => {
    const { in_params, selector } = action.invocation;
    return {
      automation: {
        ...getDeviceActionTemplate("climate"),
        type: "set_hvac_mode",
        hvac_mode: getParamValue(in_params, "mode", action, context)
      },
      placeholders: getDevicePlaceholders("climate", selector)
    };
  }
};
