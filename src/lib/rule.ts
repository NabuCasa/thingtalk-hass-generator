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
}

export interface Filter {
  operator: string;
  value: Value;
  expr: Filter;
}

export interface Value {
  value: any;
}

export interface Invocation {
  selector: Selector;
  channel: string;
  in_params: any;
}

export interface Selector {
  kind: string;
}

export interface Info {
  filters: Filter[];
  invocation?: Invocation;
}

export const getParamValue = (in_params, name: string) => {
  for (const param of in_params) {
    if (param.name === name) {
      return param.value.value;
    }
  }
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
