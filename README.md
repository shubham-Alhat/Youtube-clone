## Learning professional backend by building YT clone.

### 1. How to setup professional backend project.

1. Initilaize the node project.

```bash
npm init
```

**Note** - Create public folder. inside it temp folder. looks like `public/temp`. but these are empty folders and git cant track empty folders but files. and hence git doesn't push these folders. **But these are necessary for us to track.** Thats why create **.gitkeep** file inside `temp` folder.

public > temp > **.gitkeep** --- this will track now by git and also get pushed.

2. Create **.gitignore** file in root dir and paste code from `.gitignore generator` on internet.
3. Create **.env** file.
4. Create **src** folder. In that, Create `app.js`, `constants.js` and `index.js`.
5. Modify the **package.json** file. like to use module format, not common format. Also for running server simultanously.
6. For, use **import** statement. add `"type" : "module"`.

```javascript
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",  // here module is used...
  "scripts": {
    "start": "nodemon src/index.js"    // here the nodemon used..
  },
  "keywords": [
    "JS",
    "code"
  ],
  "author": "shubham alhat",
  "license": "ISC",
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

7. Now, Create a folders in **src** - `controllers`, `db`, `models`, `routes`, `middlewares` and `utils`.

8. For formatted code, please install **prettier as devdependencies** package.

```bash
npm i -D prettier
```

7. After that, Create a file named `.prettierrc`. i.e **.prettierrc**

**.prettierrc code -**

```javascript
{
  "singleQuote": false,
  "bracketSpacing": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "semi": true
}
```

8. Create a file `.prettierignore` and put below lines.

```bash
*env
.env
env*
node_modules
/.vscode
./dist
```
