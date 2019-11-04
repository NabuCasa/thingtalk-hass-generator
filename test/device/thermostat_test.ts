const assert = require("assert");
const thermostat = require("../../lib/device/thermostat");

describe("Thermostat trigger", () => {
  it("should handle temperature change", () => {
    assert.fail();
  });
  it("should handle humidity change", () => {
    assert.fail();
  });
  it("should handle HVAC mode change", () => {
    assert.fail();
  });
  it("should handle HVAC state change", () => {
    assert.fail();
  });
});

describe("Thermostat conditions", () => {
  it("should handle temperature check", () => {
    const condition = thermostat.CONDITIONS.get_temperature({
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
      domain: "climate",
      type: "current_temperature",
      above: "20",
      device_id: ""
    });
  });
  it("should handle humidity check", () => {
    assert.fail();
  });
  it("should handle HVAC mode check", () => {
    assert.fail();
  });
  it("should handle HVAC state check", () => {
    assert.fail();
  });
});

describe("Thermostat actions", () => {
  it("should handle changing HVAC mode", () => {
    assert.fail();
  });
  it("should handle changing target temperature", () => {
    const action = thermostat.ACTIONS.set_target_temperature({
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
      type: "target_temperature",
      temperature: "15",
      entity_id: ""
    });
  });
  it("should handle changing target temperature range", () => {
    assert.fail();
  });
});
