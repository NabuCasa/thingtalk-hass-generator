import { assert } from "chai";
import { ACTIONS, CONDITIONS, TRIGGERS } from "../../src/lib/device/io.home-assistant.switch";

describe("Switch triggers", () => {
  it("should handle an ON trigger", () => {
    const trigger = TRIGGERS.state(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: "on"
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(trigger.automation, {
      platform: "device",
      domain: "switch",
      type: "turned_on",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle device name", () => {
    const trigger = TRIGGERS.state(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: "on"
            }
          }
        ],
        invocation: {
          selector: {
            kind: "io.home-assistant.switch",
            attributes: [{ name: "name", value: { value: "bedroom" } }]
          }
        }
      },
      {}
    );
    assert.deepEqual(trigger.placeholders, {
      fields: ["device_id", "entity_id"],
      domains: ["switch"],
      name: "bedroom"
    });
  });
  it("should handle an OFF trigger", () => {
    const trigger = TRIGGERS.state(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: "off"
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(trigger.automation, {
      platform: "device",
      domain: "switch",
      type: "turned_off",
      entity_id: "",
      device_id: ""
    });
  });
});

describe("Switch conditions", () => {
  it("should handle an ON condition", () => {
    const condition = CONDITIONS.state(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: "on"
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(condition.automation, {
      condition: "device",
      domain: "switch",
      type: "is_on",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle device name", () => {
    const condition = CONDITIONS.state(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: "on"
            }
          }
        ],
        invocation: {
          selector: {
            kind: "io.home-assistant.switch",
            attributes: [{ name: "name", value: { value: "bedroom" } }]
          }
        }
      },
      {}
    );
    assert.deepEqual(condition.placeholders, {
      fields: ["device_id", "entity_id"],
      domains: ["switch"],
      name: "bedroom"
    });
  });
  it("should handle an OFF trigger", () => {
    const condition = CONDITIONS.state(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: "off"
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(condition.automation, {
      condition: "device",
      domain: "switch",
      type: "is_off",
      entity_id: "",
      device_id: ""
    });
  });
});

describe("Switch actions", () => {
  it("should handle an ON action", () => {
    const action = ACTIONS.set_power(
      {
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
      },
      {}
    );
    assert.deepEqual(action.automation, {
      domain: "switch",
      type: "turn_on",
      entity_id: "",
      device_id: ""
    });
  });
  it("should handle an OFF action", () => {
    const action = ACTIONS.set_power(
      {
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
      },
      {}
    );
    assert.deepEqual(action.automation, {
      domain: "switch",
      type: "turn_off",
      entity_id: "",
      device_id: ""
    });
  });
});
