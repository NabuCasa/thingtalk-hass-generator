const yaml = require("js-yaml");
const { parseUtterance } = require("./lib/parse");
const { convertRule } = require("./lib/convert");

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
