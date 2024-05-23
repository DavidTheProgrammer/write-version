# write-version
A simple CLI to retrieve your application version in the package.json file and write it to an `app-version.json` file somewhere.

The output is

```
{APP_VERSION: x.x.x}
```

## Installation
`npm install write-version`

## Usage
In your `package.json` insert the following script
```
"wv" : "write-version -w ./your-path-here/"
```

Then run it by typing 
```
npm run wv
```
