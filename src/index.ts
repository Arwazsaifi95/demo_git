import express, { Request } from "express";
import "reflect-metadata";
import userRoutes from "./routes/user.routes";
import folderRoutes from "./routes/folder.routes";
import folderFileRoutes from "./routes/folder-file.routes";
import projectRoutes from "./routes/project.routes";
import projectFileRoutes from "./routes/project-file.routes";
import cors from "cors";
import AppDataSource from "./config/database.config";
import dotenv from "dotenv";
import admin from 'firebase-admin';
import path from 'path'


dotenv.config();
const app = express();
const PORT = process.env.PORT || 7001;

app.use(cors());
app.use(express.json());
app.use('/objects',express.static(__dirname +'/uploads'));
// admin.initializeApp({
//   credential: admin.credential.cert('path/to/your/firebase/credentials.json'),
//   databaseURL: 'https://your-firebase-project.firebaseio.com'
// });
app.use("/api/auth", userRoutes);
app.use("/api/user/folder", folderRoutes);
app.use("/api/user/folder/folder-file", folderFileRoutes);
app.use("/api/user/project", projectRoutes);
app.use("/api/user/project/project-file", projectFileRoutes);

export function connection() {
  try {
    AppDataSource.initialize()
      .then(() => {
        console.log("postgres connected");
        app.listen(PORT, () => {
          console.log(`server is running on PORT ${PORT}`);
        });
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.error(error);
  }
}

connection();
