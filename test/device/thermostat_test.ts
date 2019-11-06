import { assert } from "chai";
import { CONDITIONS, ACTIONS, TRIGGERS } from "../../src/lib/device/thermostat";

describe("Thermostat trigger", () => {
  it("should handle temperature change", () => {
    const trigger = TRIGGERS.get_temperature({
      filters: [
        {
          operator: ">=",
          value: {
            value: "20"
          }
        }
      ]
    });
    assert.deepEqual(trigger, {
      platform: "device",
      domain: "climate",
      type: "current_temperature_changed",
      above: "20",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle humidity change", () => {
    const trigger = TRIGGERS.get_humidity({
      filters: [
        {
          operator: "<=",
          value: {
            value: "20"
          }
        }
      ]
    });
    assert.deepEqual(trigger, {
      platform: "device",
      domain: "climate",
      type: "current_humidity_changed",
      below: "20",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle HVAC mode change", () => {
    const trigger = TRIGGERS.get_hvac_state({
      filters: [
        {
          operator: "==",
          value: {
            value: "heat"
          }
        }
      ]
    });
    assert.deepEqual(trigger, {
      platform: "device",
      domain: "climate",
      type: "hvac_mode_changed",
      to: "heat",
      entity_id: "",
      device_id: ""
    });
  });
});

describe("Thermostat conditions", () => {
  it("should handle temperature check", () => {
    const condition = CONDITIONS.get_temperature({
      filters: [
        {
          operator: ">=",
          value: {
            value: "20"
          }
        }
      ]
    });
    assert.deepEqual(condition, {
      platform: "device",
      domain: "climate",
      type: "is_current_temperature",
      above: "20",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle humidity check", () => {
    const condition = CONDITIONS.get_humidity({
      filters: [
        {
          operator: "<=",
          value: {
            value: "20"
          }
        }
      ]
    });
    assert.deepEqual(condition, {
      platform: "device",
      domain: "climate",
      type: "is_current_humidity",
      below: "20",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle HVAC state check", () => {
    const condition = CONDITIONS.get_hvac_state({
      filters: [
        {
          operator: "==",
          value: {
            value: "cool"
          }
        }
      ]
    });
    assert.deepEqual(condition, {
      platform: "device",
      domain: "climate",
      type: "is_hvac_mode",
      hvac_mode: "cool",
      entity_id: "",
      device_id: ""
    });
  });
});

describe("Thermostat actions", () => {
  it("should handle changing HVAC mode", () => {
    const action = ACTIONS.set_hvac_mode({
      invocation: {
        in_params: [
          {
            name: "mode",
            value: {
              value: "cool"
            }
          }
        ]
      }
    });
    assert.deepEqual(action, {
      platform: "device",
      domain: "climate",
      type: "set_hvac_mode",
      hvac_mode: "cool",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle changing target temperature", () => {
    const action = ACTIONS.set_target_temperature({
      invocation: {
        in_params: [
          {
            name: "value",
            value: {
              value: "15"
            }
          }
        ]
      }
    });
    assert.deepEqual(action, {
      platform: "device",
      domain: "climate",
      type: "set_target_temperature",
      temperature: "15",
      entity_id: "",
      device_id: ""
    });
  });

  it("should handle changing target temperature range", () => {
    const action = ACTIONS.set_minmax_temperature({
      invocation: {
        in_params: [
          {
            name: "low",
            value: {
              value: "15"
            }
          },
          {
            name: "high",
            value: {
              value: "20"
            }
          }
        ]
      }
    });
    assert.deepEqual(action, {
      platform: "device",
      domain: "climate",
      type: "set_target_temperature",
      min_temperature: "15",
      max_temperature: "20",
      entity_id: "",
      device_id: ""
    });
  });
});
