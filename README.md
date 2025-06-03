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

### Custom api and middlewares.

1. In `app.js`, create express application and export it.

_app.js_

```javascript
import express from "express";

const app = express();

export { app };
```

2. After this, we also have listen routes..??
3. When db get connected, app should start listening. therefore, use `.then` and `.catch` to listen app after db connection method is called.

_index.js_

```javascript
import dotenv from "dotenv";
import connectToDB from "./db/connection.js";
import { app } from "./app.js";

// dotenv.config(); // i am confused whether we should we give path or not.

dotenv.config({
  path: "./env",
});

connectToDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`🚀Server running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed :", err);
  });
```

4. Install `cookie-parser` and `cors`.

```bash
npm install cookie-parser cors
```

- 🔁**cors – Cross-Origin Resource Sharing** - Allows your backend server (API) to accept requests from different origins (domains).**By default, browsers block cross-origin requests due to security reasons. If your frontend is on a different domain/port than your backend (like React on localhost:3000 and Express on localhost:5000), requests will fail unless you enable CORS.**

```javascript
import cors from "cors";

app.use(cors());
```

- You can customize it.

```javascript
app.use(
  cors({
    origin: "http://localhost:3000", // allow only this frontend
    credentials: true, // allow cookies to be sent
  })
);
```

- 🍪 **cookie-parser – Parsing Cookies in Request Headers** - Helps Express read and access cookies sent by the client (usually the browser).

---

#### Here, `app.use` are actually configuration statements.

_app.js_

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // Allow express to take json data as well.

app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Allow express to encode the url. eg " " = %20 or +. @ = %40

app.use(express.static("public")); // to store temp files on server. such files which are not imp.

app.use(cookieParser()); // allow express to set and read client's browser cookies.

export { app };
```

---

**IMP NOTE -** When we talking to database, we are going to use **Async-await** and **try-catch**. but what if we create a utility file for this. so that we dont need to write those async/await format everytime.

1. Create a file `asyncHandler.js` in **utils** folder.

_asyncHandler.js_

```javascript
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler = (func) => async (req, res, next) => {
//   try {
//     await func(req, res, next);
//   } catch (error) {
//     res.status(error.code || 400).json({
//       success: false,  // for frontend developer
//       message: error.message,
//     });
//   }
// };
```

_Same for apiError.js, apiResponse.js_

---

### Creating User and video models.

1. Create `user.model.js` inside models.

_user.model.js_

**Here, dont forget about 2nd object `timestamps:true`.**

```javascript
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required."],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
```

_Same for videoSchema_

1. Now install following packages.

```bash
npm install bcrypt jsonwebtoken mongoose-aggregate-paginate-v2
```

_user.model.js_

```javascript
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required."],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// function that should run before saving into databse
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // checks if password field is modified. here, this refer to userSchema.

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// here, we write custom methods for our user document. we created `isPasswordCorrect`
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}; // here it returns true or false

// method for generate access token.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// method for generating refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
```

**✅ if (!this.isModified("password")) return next();**

`this` refers to the user document.

`.isModified("password")` checks if the password field has been changed (for example, during sign-up or password update).

If the password was not modified, the function ends early by calling `next()` (which continues saving without doing anything extra).

🔸 This prevents hashing the password again if it’s already hashed.

✅ userSchema.methods.isPasswordCorrect
`userSchema.methods` is where you define custom functions (methods) for your user documents.

You're creating a method called **isPasswordCorrect**.
It can be used on any document created from the userSchema.
Think of this like adding a new ability to your user objects.

_video.model.js_

```javascript
import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // from cloudinary
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
```

---

### File handling | multer

Here, **file uploader will stand alone utility method. (we are going to create). reusable code for uploading avatar, video and files. also can be used as middleware wherever we need.**

1. signup/login cloudinary.
2. install cloudinary and multer

```bash
npm i cloudinary multer
```

---

#### About multer | 📷 Real-life example

1. Frontend form:

```html
<form action="/upload" method="POST" enctype="multipart/form-data">
  <input type="file" name="photo" />
  <button type="submit">Upload</button>
</form>
```

2. Backend (Node.js/Express) with Multer:

```javascript
const express = require("express");
const multer = require("multer");
const app = express();

// Use Multer to store files in a folder named "uploads"
const upload = multer({ dest: "uploads/" });

// Route to handle file upload
app.post("/upload", upload.single("photo"), (req, res) => {
  console.log(req.file); // ← Multer gives you the uploaded file here
  res.send("File uploaded!");
});
```

---

1. Now while uploading and storing files. there are two steps to follow.

- Taking file from `input-form` and storing it in our server **temporilary** using **multer.** here, we will use multer as **middleware**.
- Uploading this file from **our server** to cloudinary.

2. Create a file `cloudinary.js` in folder **utils**.
3. take you api keys from site.

_cloudinary.js_

```javascript
// Here, the file is already in our server and further code is written. In this we are uploading file in cloudinary from OUR SERVER.

// Also Once we successfully uploaded file in cloudinary, we dont need file in OUR SERVER, so we have to remove it.

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    // Check if localFilePath is there or not
    if (!localFilePath) return null;

    // upload file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // file has uploaded successfully
    console.log("file uploaded successfully on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlink(localFilePath); // remove the locally saved temporary file as the upload operation got failed.
    return null;
  }
};

export { uploadOnCloudinary };
```

---

### Lets talk about middleware (basics)

1. Create a file `multer.middleware.js` in `middlewares` folder.

_multer.middleware.js_

```javascript
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });
```

---

### Here, we complete our 95% setup configuration. 😲

---

### HTTP crash course.

![alt text](image.png)

---

### How to write controllers.

#### In this, we will be register the user.

1. Create `user.controller.js` in **controller** folder.

_user.controller.js_

```javascript
import asyncHandler from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

export { registerUser };
```

2. Create `user.routes.js` in **routes** folder.

_user.routes.js_

```javascript
import { Router } from "express";

const router = Router();

export default router;
```

**Note -** We writes routes in `app.js`. where we will import this above two methods. i.e **router** and **registerUser**. Also those import statement are written after writing middlewares. **See the below code.**

_app.js_

```javascript
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // Allow express to take json data as well.

app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Allow express to encode the url. eg " " = %20 or +. @ = %40

app.use(express.static("public")); // to store temp files on server. such files which are not imp.

app.use(cookieParser()); // allow express to set and read client's browser cookies.

// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

export { app };
```

_user.routes.js_

```javascript
import { Router } from "express";
import { registerUser } from "../controllers/user.controller";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router;
```

---

### We are tested our api (url) with postman

---

### Going to register user.

#### Steps to follow to register user.

1. Get user details from frontend - Here we will use **Postman** to get user data.
2. Validation - Whether user send empty string and details.
3. Check if user already exist - we will check by username and email.
4. Check for images - check for avatar because it is must.
5. If avatar and coverimage is available, **Store it in cloudinary**.
6. Create user object - create entry in db.
7. Remove password and refresh token field from response.
8. Check for user creation.
9. return response.

### Explaination of how data get from frontend and recieve at backend.

🧾 HTML Code Example (as you mentioned):

```html
<form action="http://localhost:3000/register" method="POST">
  <input name="name" />
  <input name="email" />
  <input name="password" />
  <button type="submit">Register</button>
</form>
```

📦 What Happens After You Click “Register”?

✅ Step 1: Browser Packs the Data (Form Submission)

The browser sees method="POST" and action="http://localhost:3000/register".

It collects all form fields that have a name attribute.

Then it encodes the data using the `application/x-www-form-urlencoded` format by default.

🧪 Example Output (What is sent):

`name=Swayam&email=swayam%40gmail.com&password=12345`

```bash
name=Swayam&email=swayam%40gmail.com&password=12345
```

This is called URL-encoded data. It’s a string of `key=value&key2=value2....`

✅ Step 3: Server Receives the Request

Your Express.js backend receives the request at the route:

```javascript
app.post("/register", (req, res) => {
  console.log(req.body); // ⬅️ you want this
});
```

**BUT WAIT — you need middleware to decode the body first.**

✅ Step 4: Body Parsing Middleware Decodes It

**You need this middleware:**

```javascript
app.use(express.urlencoded({ extended: true }));
```

**This tells Express to read and parse the incoming URL-encoded string, and convert it into an object.**

Now, req.body will look like:

```json
{
  "name": "Swayam",
  "email": "swayam@gmail.com",
  "password": "12345"
}
```
