# Setup Instructions
```bash
npm install browserify tscify watchify typescript
```

`tsconfig.json`:
```json
{
    "compilerOptions": {
        "allowJs": true,
        "rootDir": ".",
        "target": "es6",
        "module": "commonjs",
        "outDir": "./dist",
        "inlineSourceMap": true,
        "inlineSources": true,
        "lib": [
            "dom",
            "es2015",
            "es5",
            "es6"
        ]
    }
}
```

somewhere in `index.html`: 
```html
<script type='text/javascript' src='scripts/Main.js'></script>
```

compile with:
```bash
browserify scripts/Main.ts -p tsify --debug -o scripts/Main.js 
```

launch with:
```bash
xdg-open index.html
```
