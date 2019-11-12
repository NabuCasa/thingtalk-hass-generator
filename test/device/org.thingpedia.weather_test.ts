import { assert } from "chai";
import { TRIGGERS, CONDITIONS } from "../../src/lib/device/org.thingpedia.weather";

describe("sunrise triggers", () => {
  it("should handle sunrise", () => {
    const trigger = TRIGGERS.sunrise(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: false
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(trigger.automation, {
      event: "sunrise",
      platform: "sun"
    });
  });
  it("should handle sunset", () => {
    const trigger = TRIGGERS.sunrise(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: true
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(trigger.automation, {
      event: "sunset",
      platform: "sun"
    });
  });
});

describe("sunrise conditions", () => {
  it("should handle checking if sun is set", () => {
    const condition = CONDITIONS.sunrise(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: true
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(condition.automation, {
      condition: "sun",
      after: "sunset"
    });
  });
  it("should handle checking if sun is up", () => {
    const condition = CONDITIONS.sunrise(
      {
        filters: [
          {
            operator: "==",
            value: {
              value: false
            }
          }
        ]
      },
      {}
    );
    assert.deepEqual(condition.automation, {
      condition: "sun",
      after: "sunrise"
    });
  });
});
