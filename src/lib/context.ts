export interface Context {
  utterance?: string;
  thingtalk?: { code: string[]; entities: { [key: string]: string | number } };
  warnings?: Warning[];
  errors?: Error[];
}

export type Part = "trigger" | "condition" | "action";

export interface Warning {
  part: Part;
  warning: string;
  type?: string;
  kind?: string;
  channel?: string;
  value?: any;
}

export const addWarning = (context: Context, warning: Warning) => {
  if (!context.warnings) {
    context.warnings = [];
  }
  context.warnings.push(warning);
};

export const addError = (context: Context, error: Error) => {
  if (!context.errors) {
    context.errors = [];
  }
  context.errors.push(error);
};
