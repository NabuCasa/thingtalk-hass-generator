const assert = require("assert");
const lightBulb = require("../../lib/device/light-bulb");

describe("Light Bulb triggers", () => {
  it("should handle an ON trigger", () => {
    assert.fail();
  });
  it("should handle an OFF trigger", () => {
    assert.fail();
  });
});

describe("Light Bulb actions", () => {
  it("should handle an ON action", () => {
    const action = lightBulb.ACTIONS.set_power({
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
      entity_id: ""
    });
  });
  it("should handle an OFF action", () => {
    const action = lightBulb.ACTIONS.set_power({
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
      entity_id: ""
    });
  });
});
