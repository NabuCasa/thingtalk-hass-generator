## Run

```
node run.js
```

## Set up dev env

```
npm install
```

## TODO

- Can we make this a lib that we can publish to NPM ?
- Break up code into multiple files
- Convert to TypeScript
- Make it run in a browser. Only obstacle now is that we use `thingpedia.FileClient` and we should create a new `MemoryClient` that can load from memory.
- Restructure the code. Right now the code is a lot of console.log and switch-statements. That's ok for a prototype, horrible for code that going to grow a lot (as we need to support all device types that Almond will support). So we should restructure. In Almond, there are `kind` and `channel`. We should structure in such a way that we have `TRIGGERS[kind][channel](…)`:
  ```ts
  TRIGGERS = {
    thermostat: {
      get_temperature: processThermostatTemperature
    },
    "org.thingpedia.builtin.thingengine.builtin": {
      get_gps: processBuiltInGetGPS
    }
  };
  ```
