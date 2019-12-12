import { assert } from "chai";
import tt from "thingtalk";
import { convertRule } from "../src/lib/convert";
import { schemaRetriever } from "../src/lib/schema_retriever";

describe("Convert thingtalk to hass config", () => {
  it("should handle condition and action", async () => {
    const program = tt.NNSyntax.fromNN(
      [
        "now",
        "=>",
        "(",
        "@org.thingpedia.iot.temperature.temperature",
        ")",
        "filter",
        "param:value:Measure(C)",
        ">=",
        "NUMBER_0",
        "unit:F",
        "=>",
        "@light-bulb.set_power",
        "param:power:Enum(on,off)",
        "=",
        "enum:on"
      ],
      { NUMBER_0: 23 }
    );
    await program.typecheck(schemaRetriever);

    const config = await convertRule(program.rules[0]);

    assert.deepEqual(config.automation, {
      condition: [
        {
          condition: "device",
          domain: "sensor",
          entity_id: "",
          device_id: "",
          type: "temperature",
          above: 23
        }
      ],
      action: [
        {
          domain: "light",
          entity_id: "",
          device_id: "",
          type: "turn_on"
        }
      ]
    });
  });
  it("should handle trigger and action", async () => {
    const program = tt.NNSyntax.fromNN(
      [
        "edge",
        "(",
        "monitor",
        "(",
        "@org.thingpedia.builtin.thingengine.builtin.get_gps",
        ")",
        ")",
        "on",
        "param:location:Location",
        "==",
        "location:home",
        "=>",
        "@thermostat.set_target_temperature",
        "param:value:Measure(C)",
        "=",
        "NUMBER_0",
        "unit:F"
      ],
      { NUMBER_0: 20 }
    );
    await program.typecheck(schemaRetriever);

    const config = await convertRule(program.rules[0]);

    assert.deepEqual(config.automation, {
      trigger: [
        {
          platform: "zone",
          entity_id: "",
          zone: "zone.home",
          event: "enter"
        }
      ],
      action: [
        {
          domain: "climate",
          entity_id: "",
          device_id: "",
          type: "set_target_temperature",
          temperature: 20
        }
      ]
    });
  });
});
