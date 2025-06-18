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

#### HTTP Status Codes Overview

#### Categories

- **1xx** – Informational
- **2xx** – Success
- **3xx** – Redirection
- **4xx** – Client Error
- **5xx** – Server Error

---

#### 1xx – Informational

- **100** Continue
- **102** Processing

#### 2xx – Success

- **200** OK
- **201** Created
- **202** Accepted

#### 3xx – Redirection

- **307** Temporary Redirect
- **308** Permanent Redirect

#### 4xx – Client Error

- **400** Bad Request
- **401** Unauthorized
- **402** Payment Required
- **404** Not Found

#### 5xx – Server Error

- **500** Internal Server Error
- **504** Gateway Timeout

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

**Now, in user.controller.js**

```javascript
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from frontend
  // when data is coming through form submisttion or direct json, we get data from req.body

  const { fullName, email, username, password } = req.body;

  // check validation of fields
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check user if already exist
  const existedUser = await User.findOne({
    // This checks if username OR email exist
    $or: [{ username }, { email }],
  });

  // return with error if user already exist
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Now, firstly access images from fields
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // check if avatar is given or not (avatar is compulsory).
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  // upload them on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check if avatar is uploaded on cloudinary or not by checking its above response
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  // Create user object - create entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // 1. check if user obj is created or not in database. Also select and remove password and refreshToken.

  // 2. we have to remove refreshToken and password because when entry in db, we sending response to frontend for succesfull entry. this response should not contain any sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check if user created in database or not
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user.");
  }

  // Return response to frontend for succesfull entry in db
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

export { registerUser };
```

---

### We have written user controller but now lets see whether it works or not.

#### How to use Postman Un-professionally.

1. We can use it previous way like below.

- Paste the url which to test. like `http://localhost:8000/api/v1/users/register`.
- Select the method (here we select **POST**).
- Select `body`. In that, select raw and write data you want in obj form.

```json
{
  "email": "shubham@gmail.com",
  "password": "shubham292004"
}
```

- Click **send**.
- If you console log the data, see terminal, the data will be logged there.

#### How to use Postman professionally.

1. Open a new tab by pressing `+`.
2. Paste the url like `http://localhost:8000/api/v1/users/register`.
3. Select the method (here we select **POST**).
4. Select `body`.
5. In body, **Select the form-data**.
6. Here, we have to write data in key-value pair.like `key:fullname` and `value:Shubham alhat`.etc...
7. To upload **files**, select file type near `key` tab.

---

### How to setup Postman professionally

#### Watch video title `How to use postman for backend` Time stamp at `30:09`.

---

### Access token and refresh token

_user.controller.js_

```javascript
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

// generate access and refresh token method
const generateAccessAndRefreshToken = async (userId) => {
  try {
    // find user by id
    const user = await User.findById(userId);

    // generate tokens here
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // store refresh token in database
    user.refreshToken = refreshToken;
    // This is an option "validateBeforeSave:false" passed to save() to tell Mongoose NOT to run schema validations before saving.
    // “Save this user without checking all validation rules. Just save what I changed.”
    await user.save({ validateBeforeSave: false });

    // return access and refresh token
    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access and refresh token"
    );
  }
};

// -----  steps for registering user  ------
// Get user details from frontend - Here we will use Postman to get user data.
// Validation - Whether user send empty string and details.
// Check if user already exist - we will check by username and email.
// Check for images - check for avatar because it is must.
// If avatar and coverimage is available, Store it in cloudinary.
// Create user object - create entry in db.
// Remove password and refresh token field from response.
// Check for user creation.
// return response.

const registerUser = asyncHandler(async (req, res) => {
  // 1. get user details from frontend
  // when data is coming through form submisttion or direct json, we get data from req.body

  const { fullName, email, username, password } = req.body;

  // check validation of fields
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check user if already exist
  const existedUser = await User.findOne({
    // This checks if username OR email exist
    $or: [{ username }, { email }],
  });

  // return with error if user already exist
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Now, firstly access images from fields
  const avatarLocalPath = req.files?.avatar[0]?.path;

  // if user not upload coverImage
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // check if avatar is given or not (avatar is compulsory).
  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  // upload them on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // check if avatar is uploaded on cloudinary or not by checking its above response
  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  // Create user object - create entry in database
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // 1. check if user obj is created or not in database. Also select and remove password and refreshToken.

  // 2. we have to remove refreshToken and password because when entry in db, we sending response to frontend for succesfull entry. this response should not contain any sensitive information
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check if user created in database or not
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user.");
  }

  // Return response to frontend for succesfull entry in db
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully"));
});

// Login the user
// 1. Get data from req.body - email/username and password
// 2. username and email
// 3. find the user
// 4. if found, check password
// 5. Generate access and refresh token
// 6. Send them in cookies

const loginUser = asyncHandler(async (req, res) => {
  // Get data from req.body
  const { email, username, password } = req.body;

  // check if user give email and password both
  if (!email || !username) {
    throw new ApiError(400, "username or email both is required");
  }

  // find the user
  const user = await User.findOne({
    // This checks if username OR email exist
    $or: [{ username }, { email }],
  });

  // if not found, throw error that user was never registered
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }

  // check if password is right
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user credentials");
  }

  // Generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // What data want to send to user (OPTIONAL STEPS) -------
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Send them in cookies

  // our cookies can modify by frontend as well. so this options ensure that cookie only modified by backend
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // here req.user come from authmiddleware because in it, we inject user object
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };
```

---

_auth.middleware.js_

```javascript
// This middleware will verify whether user or not

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      // TODO : Discussion in next video about this part
      throw new ApiError(401, "Invalid access token");
    }

    // if user is there, create new obj "user" in req
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
```

### Talk about access and refresh token in context with frontend.

_In user.controller.js_

---

### Aggregation pipelining video.

#### What we basically going to do is joined the subscription schema to User schema - That's what aggregation pipeline means.

_user.controller.js_

```javascript
const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});
```

_Explaination_

Great question, Shubham. You're looking at a **nested aggregation pipeline**, and it’s totally normal to feel confused at first—especially when `$lookup` is used _inside another `$lookup`_. Let's break it down **step-by-step**, like a real-world story.

---

## 🧠 Simple Explanation of What This Code Does

You're trying to **get the videos a user has watched**, and for **each video**, also get info about the person who uploaded (owned) that video.

Let’s walk through it like a story:

---

### 🧍‍♂️ Step 1: Find the User

```js
{
  $match: {
    _id: new mongoose.Types.ObjectId(req.user._id);
  }
}
```

➡️ We start by **finding the logged-in user** using `req.user._id`.

Imagine you say:

> "Hey MongoDB, give me the data for _this user only_."

---

### 🎥 Step 2: Get the Watch History Videos (First \$lookup)

```js
{
  $lookup: {
    from: "videos",
    localField: "watchHistory",   // array of videoIds user watched
    foreignField: "_id",          // match those videoIds
    as: "watchHistory",           // store result in a new field
    pipeline: [ ... ]
  }
}
```

➡️ Now you say:

> "This user has a list of video IDs in `watchHistory`. Go to the `videos` collection and **find the full video data** for each of those IDs."

But it doesn't stop there…

---

### 🧑‍💻 Step 3: For Each Video, Get the Owner Info (Second \$lookup)

Inside that first `$lookup`, you have another `$lookup`:

```js
{
  $lookup: {
    from: "users",
    localField: "owner",        // field in video document
    foreignField: "_id",        // match to users
    as: "owner",
    pipeline: [
      {
        $project: {
          fullName: 1,
          username: 1,
          avatar: 1
        }
      }
    ]
  }
}
```

➡️ You're saying:

> "For each video in watch history, **get the info about the uploader** (the `owner` field in the video). Then from that owner's data, keep only `fullName`, `username`, and `avatar`."

---

### 🧍 Step 4: Simplify the Owner Field (flatten the array)

```js
{
  $addFields: {
    owner: {
      $first: "$owner";
    }
  }
}
```

➡️ You're saying:

> "Because `$lookup` gives an **array**, but we know there's only one owner, just pick the first one and make `owner` a normal object."

So instead of:

```json
owner: [
  { fullName: "Shubham", username: "shub", avatar: "pic.jpg" }
]
```

You make it:

```json
owner: { fullName: "Shubham", username: "shub", avatar: "pic.jpg" }
```

---

### 🏁 Final Output

At the end, you're returning only this:

```js
user[0].watchHistory;
```

So your response is just the list of **video objects**, each one looking something like this:

```json
{
  "_id": "videoId123",
  "title": "How to build a YouTube clone",
  "owner": {
    "fullName": "Shubham",
    "username": "shub",
    "avatar": "pic.jpg"
  }
}
```

---

## 💡 TL;DR Summary

| Step | What it does                                                            |
| ---- | ----------------------------------------------------------------------- |
| 1️⃣   | Find the user by ID                                                     |
| 2️⃣   | Use `$lookup` to get all videos in `watchHistory`                       |
| 3️⃣   | For each video, use another `$lookup` to get the video's **owner** info |
| 4️⃣   | Simplify the `owner` array into a single object using `$addFields`      |
| ✅   | Return the processed list of video documents with owner info            |

---

## 🔁 Visual Flow

```bash
[User]
  |
  └── watchHistory: [videoId1, videoId2]
             |
             └── Get full video data (from videos collection)
                       |
                       └── For each video, get its owner (from users)
                                 |
                                 └── Keep only name, username, avatar
```

---

Perfect, Shubham — now we’ll go **super practical**.

I’ll show you:

- ✅ What we’re actually trying to do
- 🔄 Stage-by-stage flow
- 📤 What each stage returns
- ➡️ How the next stage uses that output

---

## ✅ **What We’re Actually Trying to Do**

You want to return a list of videos that a user has watched (their `watchHistory`), and **for each video**, include some basic information about **who uploaded it** (video owner).

---

Let’s assume this sample data:

### 👤 `users` collection:

```js
{
  _id: ObjectId("u123"),
  name: "Shubham",
  watchHistory: [
    ObjectId("v1"),
    ObjectId("v2")
  ]
}
```

### 📹 `videos` collection:

```js
{
  _id: ObjectId("v1"),
  title: "How to build YouTube",
  owner: ObjectId("owner123")
}
```

### 👤 `users` (for video owner):

```js
{
  _id: ObjectId("owner123"),
  fullName: "Aryan Singh",
  username: "aryansingh",
  avatar: "avatar.jpg"
}
```

---

## 🔄 Stage-by-Stage Breakdown

---

### 1️⃣ `$match` — Find the logged-in user

```js
{
  $match: {
    _id: ObjectId(req.user._id);
  }
}
```

📤 **Output:**

```json
[
  {
    "_id": "u123",
    "name": "Shubham",
    "watchHistory": ["v1", "v2"]
  }
]
```

➡️ **Sent to next stage**: This array with just 1 user and their `watchHistory`.

---

### 2️⃣ `$lookup` (1st) — Join `videos` collection using watchHistory

```js
{
  $lookup: {
    from: "videos",
    localField: "watchHistory",
    foreignField: "_id",
    as: "watchHistory",
    pipeline: [...]
  }
}
```

💡 **What happens**:

- For each videoId in `watchHistory` (`v1`, `v2`)
- MongoDB looks into the `videos` collection and fetches matching documents.

📤 **Output (after this \$lookup):**

```json
[
  {
    "_id": "u123",
    "name": "Shubham",
    "watchHistory": [
      {
        "_id": "v1",
        "title": "How to build YouTube",
        "owner": "owner123"
      },
      {
        "_id": "v2",
        "title": "Learn MongoDB",
        "owner": "owner456"
      }
    ]
  }
]
```

➡️ Next stage runs inside the `pipeline` of this `$lookup` — meaning **each video** now goes through its own pipeline (the next lookup).

---

### 3️⃣ `$lookup` (2nd, nested) — Get owner of each video

```js
{
  $lookup: {
    from: "users",
    localField: "owner",
    foreignField: "_id",
    as: "owner",
    pipeline: [
      {
        $project: {
          fullName: 1,
          username: 1,
          avatar: 1
        }
      }
    ]
  }
}
```

💡 **What happens:**

- Each video has `owner: ObjectId(...)`
- MongoDB looks up matching `_id` in the `users` collection
- Only keeps `fullName`, `username`, `avatar`

📤 **Output for one video:**

```json
{
  "_id": "v1",
  "title": "How to build YouTube",
  "owner": [
    {
      "fullName": "Aryan Singh",
      "username": "aryansingh",
      "avatar": "avatar.jpg"
    }
  ]
}
```

➡️ Still, `owner` is an array — we fix that in next step.

---

### 4️⃣ `$addFields` — Flatten owner array to object

```js
{
  $addFields: {
    owner: {
      $first: "$owner";
    }
  }
}
```

📤 **Output for one video:**

```json
{
  "_id": "v1",
  "title": "How to build YouTube",
  "owner": {
    "fullName": "Aryan Singh",
    "username": "aryansingh",
    "avatar": "avatar.jpg"
  }
}
```

✅ So now, instead of this:

```js
owner: [ { ... } ]
```

We have this:

```js
owner: { ... }
```

---

### 🧾 Final Aggregated Output (entire response)

```json
[
  {
    "_id": "u123",
    "name": "Shubham",
    "watchHistory": [
      {
        "_id": "v1",
        "title": "How to build YouTube",
        "owner": {
          "fullName": "Aryan Singh",
          "username": "aryansingh",
          "avatar": "avatar.jpg"
        }
      },
      {
        "_id": "v2",
        "title": "Learn MongoDB",
        "owner": {
          "fullName": "Neha Patel",
          "username": "neha_p",
          "avatar": "neha.jpg"
        }
      }
    ]
  }
]
```

---

### 🧠 And finally in the code:

```js
user[0].watchHistory;
```

You're just returning the list of **processed video objects** — not the full user.

---

## 🔁 Flow Recap (Visually)

```
[Users Collection]
     |
     | $match: find one user by _id
     ↓
[User: { watchHistory: [v1, v2] }]
     |
     | $lookup: Get video docs from videoIds
     ↓
[watchHistory: [ video1, video2 ]]
     |
     | $lookup (nested): Get video.owner from users
     ↓
[Each video now has owner info]
     |
     | $addFields: convert owner from array → object
     ↓
Return: watchHistory videos with clean owner info
```

---

## ✅ Summary

| Stage              | Input                 | Output                         | Purpose                    |
| ------------------ | --------------------- | ------------------------------ | -------------------------- |
| `$match`           | All users             | Only logged-in user            | Select relevant user       |
| `$lookup` (videos) | watchHistory ids      | Full video documents           | Join user's watched videos |
| `$lookup` (owners) | video.owner           | User info of uploader          | Join owner info into video |
| `$addFields`       | owner (array)         | owner (object)                 | Clean up output            |
| Final              | user\[0].watchHistory | List of videos with owner info | Final response             |

---

Want me to turn this into a **flowchart image** or help you refactor this into **simpler functions**? Or add filters like "watch history this week only"? Let’s build next level 👊

```javascript
[
  {
    _id: "c1",
    content: "Great video!",
    video: "v1",
    owner: {
      // Now it's a SINGLE OBJECT (not array)
      _id: "u1",
      fullName: "John Doe",
      username: "john",
      avatar: "john.jpg",
    },
  },
  {
    _id: "c2",
    content: "Nice work!",
    video: "v1",
    owner: {
      // Single object
      _id: "u2",
      fullName: "Jane Smith",
      username: "jane",
      avatar: "jane.jpg",
    },
  },
];
```

Absolutely Shubham. Here's a practical list of **HTTP status codes** you’ll use **99% of the time** in real-world backend development — especially in REST APIs like your YouTube clone.

---

## ✅ **MOST COMMON STATUS CODES** (Grouped by Use Case)

---

### 🔵 1. **Creating / Storing Data (POST)**

| Situation                                 | Status | Meaning          |
| ----------------------------------------- | ------ | ---------------- |
| Created successfully                      | `201`  | **Created**      |
| Validation failed (e.g., empty input)     | `400`  | **Bad Request**  |
| Auth required but missing                 | `401`  | **Unauthorized** |
| Resource conflict (e.g., duplicate email) | `409`  | **Conflict**     |
| Authenticated but no permission           | `403`  | **Forbidden**    |

---

### 🟢 2. **Fetching Data (GET)**

| Situation                       | Status | Meaning              |
| ------------------------------- | ------ | -------------------- |
| Data found and returned         | `200`  | **OK**               |
| No data found (empty list okay) | `200`  | **OK** (still valid) |
| Resource not found (invalid ID) | `404`  | **Not Found**        |

---

### 🟡 3. **Updating Data (PATCH/PUT)**

| Situation                                    | Status | Meaning         |
| -------------------------------------------- | ------ | --------------- |
| Updated successfully                         | `200`  | **OK**          |
| Validation or missing input                  | `400`  | **Bad Request** |
| Trying to update something not owned by user | `403`  | **Forbidden**   |
| Target not found (e.g., comment ID)          | `404`  | **Not Found**   |

---

### 🔴 4. **Deleting Data (DELETE)**

| Situation                    | Status | Meaning       |
| ---------------------------- | ------ | ------------- |
| Deleted successfully         | `200`  | **OK**        |
| Already deleted or not found | `404`  | **Not Found** |
| Not authorized to delete it  | `403`  | **Forbidden** |

---

### 🔐 5. **Authentication / Security**

| Situation                                        | Status | Meaning          |
| ------------------------------------------------ | ------ | ---------------- |
| Logged in / token generated                      | `200`  | **OK**           |
| Token expired / invalid                          | `401`  | **Unauthorized** |
| Trying to access something you're not allowed to | `403`  | **Forbidden**    |

---

### ⚠️ 6. **Server Errors**

| Situation                      | Status | Meaning                   |
| ------------------------------ | ------ | ------------------------- |
| Something crashed or exception | `500`  | **Internal Server Error** |

---

## 🧠 Pro Tips:

- Use `200` for almost all successful GET, PATCH, DELETE responses.
- Use `201` only when you're **creating** something.
- Use `400` if the client did something wrong (missing field, invalid type, etc.).
- Use `401` if token is missing or invalid.
- Use `403` if user is logged in but **not allowed** (e.g., trying to edit someone else's comment).
- Use `500` if **your server code** broke.

---

## 🧪 Sample Response Structure (Good Practice)

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": { ... } // or [] or null
}
```

If something goes wrong:

```json
{
  "success": false,
  "message": "Video not found",
  "error": "Invalid videoId or it may have been deleted"
}
```

---

Let me know if you want a helper function to send consistent responses (like a `sendResponse()` util).
