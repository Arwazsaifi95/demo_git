import { Request, Response } from "express";
import AppDataSource from "../config/database.config";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { User } from "../entity/user.model";
import { generateToken } from "../utils/jwt.util";
import fs from "fs";
const curr_User = AppDataSource.getRepository(User);

//Sigup Service
export const registerService = async (
  username: string,
  email: string,
  password: string,
  locations: string,
  fileName: string
) => {
  try {
    const existingUserEmail = await curr_User.findOneBy({
      email: email,
    });
    if (existingUserEmail) {
      throw new Error("User with same name already exists");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = curr_User.create({
      username,
      email,
      password: hashPassword,
      locations,
      profileImage: fileName,
    });

    const saveUser = await curr_User.save(user);
    return saveUser;
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};

export const registerGoogleService = async (req: Request, res: Response) => {
  const { username, email, password, locations } = req.body;
  try {
    const existingUserEmail = await curr_User.findOneBy({
      email,
    });
    if (existingUserEmail) {
      return res.status(409).send({ message: "Email already register" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = curr_User.create({
      id: uuidv4(),
      username,
      email,
      password: hashPassword,
      locations,
      profileImage: req.file?.filename,
    });
    const saveUser = await curr_User.save(user);

    if (!saveUser) {
      res.status(404).json({ message: "error in saving user" });
    }
    return saveUser;
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};
//Login with google service
export const loginGoogleService = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await curr_User.findOneBy({
      email,
    });
    if (!user) {
      const newUser = await registerGoogleService(req, res);
      return res
        .status(200)
        .json({ message: "Successfully registered ", newUser });
    } else {
      const access_token = generateToken({ id: user.id, email: user.email });
      return res
        .status(200)
        .json({ message: "Successfully Logged In", token: access_token });
    }
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};

//Login service
export const loginService = async (email: string, password: string) => {
  const user = await curr_User.findOneBy({
    email: email,
  });

  if (!user) {
    throw new Error("User Not found");
  }
  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    throw new Error("Wrong Password");
  } else {
    const access_token = generateToken({ id: user.id, email: user.email });
    return access_token;
  }
};

export const updateProfileService = async (id:string,username:string, password:string, newPassword: string, locations:string,file:any) => {
  try {
    let user = await curr_User.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    if (password && newPassword) {
      const result = await bcrypt.compare(password, user.password);
      if (!result) {
        throw new Error("Wrong password");
      }
      const hashPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashPassword;
    }
    if (username) {
      user.username = username;
    }
    if (locations) {
      user.locations = locations;
    }
    if (file) {
      if (fs.existsSync(user.profileImage)) fs.unlinkSync(user.profileImage);
      user.profileImage = file.filename;
    }
    await curr_User.save(user);
    return user; 
  } catch (error) {
    throw error; 
  }
};
