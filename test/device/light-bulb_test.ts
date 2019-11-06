import { assert } from "chai";
import { ACTIONS, TRIGGERS } from "../../src/lib/device/light-bulb";

describe("Light Bulb triggers", () => {
  it("should handle an ON trigger", () => {
    const trigger = TRIGGERS.power({
      filters: [
        {
          operator: "==",
          value: {
            value: "on"
          }
        }
      ]
    });
    assert.deepEqual(trigger, {
      platform: "device",
      domain: "light",
      type: "turned_on",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle an OFF trigger", () => {
    const trigger = TRIGGERS.power({
      filters: [
        {
          operator: "==",
          value: {
            value: "off"
          }
        }
      ]
    });
    assert.deepEqual(trigger, {
      platform: "device",
      domain: "light",
      type: "turned_off",
      entity_id: "",
      device_id: ""
    });
  });
});

describe("Light Bulb actions", () => {
  it("should handle an ON action", () => {
    const action = ACTIONS.set_power({
      invocation: {
        in_params: [
          {
            name: "power",
            value: {
              value: "on"
            }
          }
        ]
      }
    });
    assert.deepEqual(action, {
      platform: "device",
      domain: "light",
      type: "turn_on",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle an OFF action", () => {
    const action = ACTIONS.set_power({
      invocation: {
        in_params: [
          {
            name: "power",
            value: {
              value: "off"
            }
          }
        ]
      }
    });
    assert.deepEqual(action, {
      platform: "device",
      domain: "light",
      type: "turn_off",
      entity_id: "",
      device_id: ""
    });
  });
});
