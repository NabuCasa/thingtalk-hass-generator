import { assert } from "chai";
import {
  TRIGGERS,
  CONDITIONS
} from "../../src/lib/device/org.thingpedia.builtin.thingengine.builtin";

describe("get_gps triggers", () => {
  it("should handle entering a zone", () => {
    const trigger = TRIGGERS.get_gps({
      filters: [
        {
          operator: "==",
          value: {
            value: {
              relativeTag: "home"
            }
          }
        }
      ]
    });
    assert.deepEqual(trigger, {
      event: "enter",
      platform: "zone",
      zone: "zone.home",
      entity_id: ""
    });
  });
  it("should handle leaving a zone", () => {
    const trigger = TRIGGERS.get_gps({
      filters: [
        {
          expr: {
            operator: "==",
            value: {
              value: {
                relativeTag: "work"
              }
            }
          },
          isNot: true
        }
      ]
    });
    assert.deepEqual(trigger, {
      event: "leave",
      platform: "zone",
      zone: "zone.work",
      entity_id: ""
    });
  });
});

describe("get_gps conditions", () => {
  it("should handle checking if in a zone", () => {
    const condition = CONDITIONS.get_gps({
      filters: [
        {
          operator: "==",
          value: {
            value: {
              relativeTag: "home"
            }
          }
        }
      ]
    });
    assert.deepEqual(condition, {
      condition: "zone",
      zone: "zone.home",
      entity_id: ""
    });
  });
  it("should handle checking if not in a zone", () => {
    const condition = CONDITIONS.get_gps({
      filters: [
        {
          expr: {
            operator: "==",
            value: {
              value: {
                relativeTag: "work"
              }
            }
          },
          isNot: true
        }
      ]
    });
    assert.deepEqual(condition, {
      condition: "zone",
      zone: "zone.work",
      entity_id: ""
    });
  });
});
