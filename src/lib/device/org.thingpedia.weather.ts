import { Info } from "../rule";
import { getFilterValue } from "../convert";
import { Context } from "../context";

export interface SunTrigger {
  platform: "sun";
  event: "sunrise" | "sunset";
}

export interface SunCondition {
  condition: "sun";
  after?: "sunrise" | "sunset";
  before?: "sunrise" | "sunset";
}

export const TRIGGERS = {
  sunrise: (info: Info, context: Context): { automation: SunTrigger } => {
    return {
      automation: {
        platform: "sun",
        event: getFilterValue(info, context) ? "sunset" : "sunrise"
      }
    };
  }
};

export const CONDITIONS = {
  sunrise: (info: Info, context: Context): { automation: SunCondition } => {
    return {
      automation: {
        condition: "sun",
        after: getFilterValue(info, context) ? "sunset" : "sunrise"
      }
    };
  }
};
