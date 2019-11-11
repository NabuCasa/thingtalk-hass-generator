import yaml from "js-yaml";
import { parseUtterance } from "./lib/parse";
import { convertRule } from "./lib/convert";
import readline from "readline";
import { Context } from "./lib/context";

async function printRule(rule, context: Context) {
  const result = await convertRule(rule, context);
  const automation = result.automation;
  const placeholders = result.placeholders;

  printContext(context);

  if (!Object.keys(automation).length) {
    console.log("We could not create a Home Assistant Automation");
    return;
  }
  console.log("Home Assistant Automation:");
  console.log();
  console.log(yaml.safeDump(automation));

  console.log("Placeholders:");
  console.log();
  console.log(yaml.safeDump(placeholders));
}

function printContext(context: Context) {
  console.log("Context:");
  console.log();
  console.log(context);
}

function printProgram(program, context: Context) {
  debugger;
  for (const rule of program.rules) {
    printRule(rule, context);
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
      let program;
      const context: Context = {};
      try {
        program = await parseUtterance(utterance, context);
      } catch (error) {
        console.error(error.message);
        console.log();
        printContext(context);
        linereader.close();
        return;
      }

      printProgram(program, context);
      console.log();
      setTimeout(ask, 0);
    });
  }
  ask();
}

main();
