import yaml from "js-yaml";
import { parseUtterance } from "./lib/parse";
import { convertRule, AutomationConfig } from "./lib/convert";
import readline from "readline";

async function printRule(rule) {
  let haSyntax: AutomationConfig = await convertRule(rule);

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
  const linereader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function ask() {
    linereader.question(`What is your command?\n`, async utterance => {
      utterance = utterance.trim();

      if (utterance === "") {
        linereader.close();
        return;
      }

      console.log();
      const ast = await parseUtterance(utterance);

      if (ast == null) {
        linereader.close();
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
