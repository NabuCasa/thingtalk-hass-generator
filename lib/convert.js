const { convertTrigger } = require("./convert_trigger");
const { convertCondition } = require("./convert_condition");
const { convertAction } = require("./convert_action");

module.exports.convertRule = rule => {
  const automation = {};

  convertTrigger(automation, rule);
  convertCondition(automation, rule);
  convertAction(automation, rule);

  return automation;
};
