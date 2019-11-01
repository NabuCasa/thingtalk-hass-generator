const axios = require("axios");
const tt = require("thingtalk");
const thingpedia = require("thingpedia");
const yaml = require("js-yaml");

const nnCode = `
edge (
  monitor ( @org.thingpedia.builtin.thingengine.builtin.get_gps )
) on param:location:Location == location:home =>
    @light-bulb.set_power param:power:Enum(on,off) = enum:on
;
`;

const schemaRetriever = new tt.SchemaRetriever(
  new thingpedia.FileClient({
    locale: "en_US",
    thingpedia: "thingpedia.tt"
  }),
  null,
  true
);

// PARSE FUNCTIONS

// There are two types of ThingTalk. Human created and Neural Network created.
// They convert to the same AST.

const parseHumanTT = async code =>
  tt.Grammar.parseAndTypecheck(code, schemaRetriever);

const parseNNTT = async (code, entities) => {
  const ast = tt.NNSyntax.fromNN(code.split(" "), entities);
  await ast.typecheck(schemaRetriever);
  return ast;
};

async function parseUtterance(utterance) {
  const response = await axios.get(
    `https://almond-nl.stanford.edu/en-US/query`,
    {
      params: {
        q: utterance,
        thingtalk_version: "1.8.0"
      }
    }
  );

  if (response.data.candidates.length === 0) {
    console.error("Unable to parse utterance!");
    return null;
  }

  console.log(response.data.candidates[0].code.join(" "));
  console.log(response.data.entities);
  console.log();

  const ast = tt.NNSyntax.fromNN(
    response.data.candidates[0].code,
    response.data.entities
  );

  await ast.typecheck(schemaRetriever);

  return ast;
}

// Print a rule as YAML

function printRule(rule) {
  let haSyntax = convertRule(rule);

  if (!haSyntax.trigger) {
    // This is a script.

    if (haSyntax.condition) {
      console.warn(
        "Creating a script. All conditions are lost because we do not yet support device conditions in scripts."
      );
      console.log();
      delete haSyntax.condition;
    }

    haSyntax.script = haSyntax.action;
    delete haSyntax.action;

    console.log("Home Assistant Script:");
  } else {
    console.log("Home Assistant Automation:");
  }
  console.log();
  console.log(yaml.safeDump(haSyntax));
}

function convertRule(rule) {
  const automation = {
    placeholder_info: {},
    placeholder: {}
  };

  // Check for a trigger
  if (rule.stream) {
    // Gather stream info
    let stream = rule.stream;

    const info = {
      filters: []
    };

    while (stream) {
      const type = stream.constructor.className;

      if (stream.filter) {
        info.filters.push(stream.filter);
      }

      switch (type) {
        case "Monitor":
          const tableInfo = getTableInfo(stream.table);
          info.filters.push(...tableInfo.filters);
          if (tableInfo.invocation) {
            info.invocation = tableInfo.invocation;
          }
          break;

        case "EdgeFilter":
          // Nothing to do
          break;

        default:
          console.warn("Unknown type", type);
      }

      stream = stream.stream;
    }

    const trigger = {};

    // convert stream info to automation trigger
    if (info.invocation) {
      const kind = info.invocation.selector.kind;
      const channel = info.invocation.channel;
      let warn = false;

      switch (kind) {
        case "thermostat":
          switch (channel) {
            case "get_temperature":
              automation.placeholder_info.trigger_climate_device = {
                type: "entity",
                filter: {
                  domain: "climate"
                }
              };
              trigger.platform = "device";
              trigger.entity_id = "placeholder:trigger_climate_entity";
              trigger.domain = "climate";
              trigger.type = "current_temperature";

              for (const filter of info.filters) {
                switch (filter.operator) {
                  case ">=":
                    // TODO compare to unit. filter.value.unit == C/F
                    trigger.above = filter.value.value;
                    break;

                  case "<=":
                    // TODO compare to unit. filter.value.unit == C/F
                    trigger.below = filter.value.value;
                    break;

                  default:
                    console.warn(
                      "Unknown operator for filter",
                      kind,
                      channel,
                      filter
                    );
                }
              }

              break;
            default:
              warn = true;
          }

        case "org.thingpedia.builtin.thingengine.builtin":
          switch (channel) {
            case "get_gps":
              automation.placeholder_info.trigger_person_zone = {
                type: "entity",
                filter: {
                  domain: "person"
                }
              };
              trigger.platform = "zone";
              trigger.entity_id = "placeholder:trigger_person_zone";

              for (const filter of info.filters) {
                switch (filter.operator) {
                  case "==":
                    trigger.zone = `zone.${filter.value.value.relativeTag}`;
                    break;

                  default:
                    console.warn(
                      "Unknown operator for filter",
                      kind,
                      channel,
                      filter
                    );
                }
              }
              break;

            default:
              warn = true;
          }

          break;

        case "org.thingpedia.weather":
          switch (channel) {
            default:
              warn = true;
          }

          break;

        default:
          warn = true;
      }

      if (warn) {
        console.warn("Unable to deal with stream kind", kind, channel);
      } else {
        automation.trigger = [trigger];
      }
    } else {
      console.warn("No trigger source found.");
    }
  }

  // Process the filter on the expression
  // This becomes the condition.
  if (rule.table) {
    const info = getTableInfo(rule.table);

    if (info.invocation) {
      const condition = {};

      const kind = info.invocation.selector.kind;
      const channel = info.invocation.channel;
      let warn = false;

      switch (kind) {
        case "thermostat":
          switch (channel) {
            case "get_temperature":
              automation.placeholder_info.condition_climate_device = {
                type: "device",
                filter: {
                  domain: "climate"
                }
              };
              automation.placeholder.climate_device = "";
              condition.device_id = "placeholder:climate_device";
              condition.domain = "climate";
              condition.type = "current_temperature";

              for (const filter of info.filters) {
                switch (filter.operator) {
                  case ">=":
                    // TODO compare to unit. filter.value.unit == C/F
                    condition.above = filter.value.value;
                    break;

                  case "<=":
                    // TODO compare to unit. filter.value.unit == C/F
                    condition.below = filter.value.value;
                    break;

                  default:
                    console.warn(
                      "Unknown operator for filter",
                      kind,
                      channel,
                      filter
                    );
                }
              }
              break;

            default:
              warn = true;
          }
          break;

        default:
          warn = true;
      }

      if (warn) {
        console.warn("Unable to deal with condition kind", kind, channel);
      } else {
        automation.condition = condition;
      }
    }
  }

  // Process the action
  if (rule.actions) {
    const actions = [];

    for (const action of rule.actions) {
      const kind = action.invocation.selector.kind;
      const { channel, in_params } = action.invocation;
      let warn = false;

      switch (kind) {
        case "light-bulb":
          switch (channel) {
            // This one is probably generalizable?
            case "set_power":
              automation.placeholder_info.action_set_power_entity = {
                type: "entity",
                filter: {
                  domain: "light"
                }
              };
              actions.push({
                platform: "device",
                type:
                  getParamValue(in_params, "power") == "on"
                    ? "turn_on"
                    : "turn_off",
                entity_id: "placeholder:action_set_power_entity"
              });
              break;

            default:
              warn = true;
          }
          break;

        default:
          warn = true;
      }

      if (warn) {
        console.warn(
          "Unknown action",
          action.invocation.selector.kind,
          action.invocation.channel
        );
        for (const param of action.invocation.in_params) {
          console.warn(param.name, "=", param.value.value);
        }
      } else if (automation) {
        automation.action = actions;
      }
    }
  }

  if (Object.keys(automation.placeholder_info).length === 0) {
    delete automation.placeholder;
    delete automation.placeholder_info;
  } else {
    for (const key of Object.keys(automation.placeholder_info)) {
      automation.placeholder[key] = "";
    }
  }

  return automation;
}

function getParamValue(in_params, name) {
  for (const param of in_params) {
    if (param.name === name) {
      return param.value.value;
    }
  }
}

function getTableInfo(table) {
  const info = {
    filters: []
  };

  while (table) {
    if (table.filter) {
      info.filters.push(table.filter);
    }
    if (table.invocation) {
      info.invocation = table.invocation;
    }

    table = table.table;
  }
  return info;
}

function printProgram(program) {
  debugger;
  for (const rule of program.rules) {
    printRule(rule);
  }
}

async function main() {
  // printProgram(
  //   await parseNNTT(
  //     `now => ( @thermostat.get_temperature ) filter param:value:Measure(C) >= NUMBER_0 unit:C => @light-bulb.set_power param:power:Enum(on,off) = enum:on`,
  //     {
  //       NUMBER_0: 23
  //     }
  //   )
  // );
  // printProgram(
  //   await parseNNTT(
  //     `edge ( monitor ( @thermostat.get_temperature ) ) on param:value:Measure(C) >= NUMBER_0 unit:C => @light-bulb.set_power param:power:Enum(on,off) = enum:on`,
  //     {
  //       NUMBER_0: 21
  //     }
  //   )
  // );
  // console.log();
  // console.log();
  // console.log();
  // printProgram(
  //   await parseHumanTT(
  //     `monitor @thermostat.get_temperature(), value >= 21C => @org.thingpedia.builtin.thingengine.builtin.say(message="bla");`
  //   )
  // );
  // console.log();
  // console.log();
  // console.log();
  // printProgram(
  //   await parseUtterance(
  //     "When the thermostat is above 23 celsius, turn on the light"
  //   )
  // );
  // console.log();
  // console.log();
  // console.log();
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function ask() {
    readline.question(`What is your command?\n`, async utterance => {
      utterance = utterance.trim();

      if (utterance === "") {
        readline.close();
        return;
      }

      console.log();
      const ast = await parseUtterance(utterance);

      if (ast == null) {
        readline.close();
        return;
      }

      printProgram(ast);
      console.log();
      setTimeout(ask, 0);
    });
  }
  ask();
}

main();
