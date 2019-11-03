## Run

```
node lib/index.js
```

## Set up dev env

```
npm install
```

## TODO

- Can we make this a lib that we can publish to NPM ?
- Convert to TypeScript
- How do we deal with units? (C/F) -> We should pass a context object around to deal with such things
- Make it run in a browser. Only obstacle now is that we use `thingpedia.FileClient` and we should create a new `MemoryClient` that can load from memory.
