import { assert } from "chai";
import { convertRule } from "../src/lib/convert";
import tt from "thingtalk";
import { schemaRetriever } from "../src/lib/schema_retriever";

describe("convert thingtalk to hass config", () => {
  it("should handle condition and action", async () => {
    const program = tt.NNSyntax.fromNN(
      [
        "now",
        "=>",
        "(",
        "@thermostat.get_temperature",
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

    assert.deepEqual(config, {
      condition: [
        {
          platform: "device",
          domain: "climate",
          entity_id: "",
          device_id: "",
          type: "is_current_temperature",
          above: 23
        }
      ],
      action: [
        {
          platform: "device",
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

    assert.deepEqual(config, {
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
          platform: "device",
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
