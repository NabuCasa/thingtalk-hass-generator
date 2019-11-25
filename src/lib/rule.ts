import { Part, addWarning, Context } from "./context";

export interface Table {
  filter: Filter;
  invocation: Invocation;
  table?: Table;
}

export interface Rule {
  stream?: Stream;
  actions?: Action[];
  table: Table;
}

export interface Stream {
  filter: Filter;
  table: Table;
  stream?: Stream;
}

export interface Action {
  invocation: Invocation;
  selector?: Selector;
  part?: Part;
}

export interface Filter {
  operator?: string;
  name?: string;
  value?: Value;
  expr?: Filter;
  isNot?: boolean;
  channel?: string;
  selector?: Selector;
  operands?: any[];
  toJSON?: () => { [key: string]: any };
}

export interface Value {
  value: any;
}

export interface Invocation {
  selector?: Selector;
  channel?: string;
  in_params?: any;
}

export interface Selector {
  kind: string;
  attributes?: any[];
  principal?: any;
  id?: any;
}

export interface Info {
  filters: Filter[];
  invocation?: Invocation;
  part?: Part;
}

export const getParamValue = (in_params, name: string, info: Info | Action, context: Context) => {
  for (const param of in_params) {
    if (param.name === name) {
      return param.value.value;
    }
  }
  addWarning(context, {
    part: info.part!,
    warning: "parameter not found",
    kind: info.invocation!.selector!.kind,
    channel: info.invocation!.channel,
    value: { in_params, name }
  });
};

export const getTableInfo = (table: Table | undefined) => {
  const info: Info = {
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
};
