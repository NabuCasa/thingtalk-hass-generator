import yaml from "js-yaml";
import { parseUtterance } from "./lib/parse";
import { convertRule, AutomationConfig } from "./lib/convert";
import readline from "readline";

async function printRule(rule) {
  let haSyntax: AutomationConfig = await convertRule(rule);

  console.log("Home Assistant Automation:");
  console.log();
  console.log(haSyntax);
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
