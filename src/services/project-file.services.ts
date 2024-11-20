import AppDataSource from "../config/database.config";
import { Request, Response } from "express";
import { ProjectFile } from "../entity/project-file.model";

const projectFileRepository = AppDataSource.getRepository(ProjectFile);

export const createProjectFileService = async (
  name: string,
  projectId: string,
  isShared: boolean,
  isFavourite: boolean
) => {
  try {
    const existingProjectName = await projectFileRepository.findOneBy({
      name,
    });
    if (existingProjectName) {
      throw new Error("Project File with same name already exists");
    }
    const ProjectFile = projectFileRepository.create({
      name,
      projectId,
      isShared,
      isFavourite,
    });

    const savedProject = await projectFileRepository.save(ProjectFile);

    return savedProject;
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};

export const deleteProjectFileService = async (id: string) => {
  try {
    const projectFile = await projectFileRepository.findOneBy({
      id,
    });
    if (!projectFile) {
      throw new Error("Project File Not Found");
    }

    await projectFileRepository.delete({ id });

    return projectFile;
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};

export const getProjectFileService = async (id: string) => {
  try {
    const folder = await projectFileRepository.findOneBy({
      id: id,
    });
    if (!folder) {
      throw new Error("Project File Not Found");
    }
    return folder;
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};

export const getAllProjectFileService = async (id: string) => {
  try {
    const folder = await projectFileRepository.findBy({
      projectId: id,
    });
    if (!folder) {
      throw new Error("Project File Not Found");
    }
    return folder;
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};

export const updateProjectFileService = async (
  id: string,
  name: string,
  isShared: boolean,
  isFavourite: boolean
) => {
  try {
    let projectFile = await projectFileRepository.findOneBy({ id });
    if (!projectFile) {
      throw new Error("Project File Not Found");
    }
    projectFile.name = name || projectFile.name;
    projectFile.isShared = isShared || projectFile.isShared;
    projectFile.isFavourite = isFavourite || projectFile.isFavourite;
    const savedProjectFile = await projectFileRepository.save(projectFile);
    return savedProjectFile;
  } catch (error: unknown) {
    if (typeof error === "object" && error) {
      if ("message" in error)
        throw new Error(error?.message as unknown as string);
    }
    throw new Error("Internal Server error");
  }
};
