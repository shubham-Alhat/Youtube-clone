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

Hey! 😊 I totally get how intimidating backend and database stuff can feel at first — **but don’t worry**, you’re not alone, and I’ll guide you step-by-step to set up **MongoDB Atlas** and connect it to your application.

### 🧠 First, what is MongoDB Atlas?

MongoDB Atlas is a **cloud database service** for MongoDB. It’s where your app’s data will be stored, like user profiles, messages, posts, etc. And don’t worry, **you don’t need to install MongoDB locally.**

---

### ✅ Step-by-Step Guide to Set Up MongoDB Atlas and Connect to Your App - ChatGPT.

---

### 🛠️ 1. **Create a MongoDB Atlas Account**

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click on **"Start Free"** or **Sign Up** (use Google/GitHub or email)
3. Once you're in, choose **"Shared Cluster"** (free tier).

---

### 🧱 2. **Create Your First Cluster**

1. Choose **any cloud provider** (AWS is fine) and a nearby region.
2. Keep everything default and click **"Create Cluster"**.

   - This will take a few minutes.

---

### 👤 3. **Create Database User**

1. Go to **Database > Database Access**
2. Click **“Add New Database User”**
3. Set a username and password (you’ll need it later in your code)
4. Select **“Read and Write to Any Database”**
5. Click **“Add User”**

---

### 🔐 4. **Allow Access from Anywhere**

1. Go to **Network Access**
2. Click **“Add IP Address”**
3. Click **“Allow Access from Anywhere”** (`0.0.0.0/0`)  **(only for beginners and practice project)**
4. Save it

---

### 📦 5. **Create a Database**

1. Go to **Databases > Browse Collections**
2. Click **“Add My Own Data”**
3. Give it a database name (e.g., `myAppDB`)
4. Give it a collection name (e.g., `users`)
5. Click Create

---

### 🔗 6. **Connect MongoDB Atlas to Your App**

1. Go to **Database > Connect > Connect Your Application**

2. Copy the **connection string** — it looks like:

   ```
   mongodb+srv://<username>:<password>@cluster0.abcd.mongodb.net/?retryWrites=true&w=majority
   ```

3. Replace `<username>` and `<password>` with the ones you created earlier.

---

### 💻 7. **Using MongoDB Atlas in Your Node.js Backend**

Install MongoDB driver:

```bash
npm install mongodb
```

Or if you use Mongoose (easier):

```bash
npm install mongoose
```

#### Example using Mongoose (recommended for beginners):

```js
const mongoose = require("mongoose");

mongoose
  .connect("your_connection_string_here", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
```

> Store your connection string safely in a `.env` file like:

```
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxxx.mongodb.net/?retryWrites=true&w=majority
```

> And access it in your code using:

```js
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { ... });
```

---

### 🧪 8. **Create a Simple Schema (e.g., for users)**

```js
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
```

---

### 🎯 That’s It! You’ve set up MongoDB Atlas!

You’re now ready to:

- Store users, posts, comments, etc.
- Read/write/delete from your frontend using APIs (Express.js etc.)

---

### After setting up Atlas - By Hitesh.

1. Load env's in `.env` file.

```env
PORT=8000
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxxx.mongodb.net
```

2. In `constants.js`, define you database name.

```javascript
export const DB_NAME = "youtube";
```

3. Install `express`, `dotenv` and `mongoose`.

```bash
npm install express dotenv mongoose
```

**IMP NOTE ON DATABASE -** Whenever sending and recieving requests, there are possible errors may occur. And also, databases are in different continents, so it takes time. Therefore follow below lines.

- **Use `try-catch` in every DB code for error handling.**
- **Use `Async-await` to avoid asynchronous tasks.**

4. Connecting mongoDB yo our app. **(Not professional way)**

- Here, we are using an **IIFE (Immediately Invoked Function Expression) with async to connect to MongoDB, which is perfectly fine..**

_index.js_

```javascript
import mongoose from "mongoose";
import { DB_NAME } from "./constants";

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
})();
```

5. Connecting using professional approach **(Recommended)**.

- Create a folder `db`. In that folder, create a file name `connection.js`.

_connection.js_

```javascript
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectToDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\n database connected.. DB_HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGO_DB CONNECTION ERROR:", error);
    process.exit(1); // to exit the process
  }
};

export default connectToDB;
```

6. Now, In index.js and also, **we modify script in package.json file**.

#### From this

```json
"start": "nodemon src/index.js"
```

#### To this

```json
"start": "nodemon -r dotenv/config --experimental-json-modules src/index.js"  // preloads environment variables
```

_index.js_

```javascript
import dotenv from "dotenv";
import connectToDB from "./db/connection";

// dotenv.config(); // i am confused whether we should we give path or not.

dotenv.config({
  path: "./env",
});

connectToDB();
```

---

### Starting the app.

1. Run following command to start app.

```bash
npm start
```

### 🚨 ERROR THROWS HERE ON TERMINAL DUE TO INVALID STRING.

- My password contains '**@**' which conflict with mongodb url and error occured. **I converted `@` into `%40`**

- Also, while importing files. use `.js` extension as well.

---

### App is running now..

---
