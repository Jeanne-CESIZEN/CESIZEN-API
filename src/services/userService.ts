import { UserModel } from "@/models/user";
import {
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
} from "@/validators/userValidator";
import { hashPassword } from "@/utils/hashPassword";
import { Role } from "@/generated/prisma";

export const createUser = async (
  data: CreateUserInput
): Promise<UserResponse> => {
  const emailExists = await UserModel.existsByEmail(data.email);
  if (emailExists) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await UserModel.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  return await UserModel.findAll();
};

export const getUserById = async (id: number): Promise<UserResponse> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput
): Promise<UserResponse> => {
  const existingUser = await UserModel.findById(id);
  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (data.email && data.email !== existingUser.email) {
    const emailExists = await UserModel.existsByEmail(data.email);
    if (emailExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
  }

  const updateData: any = { ...data };

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const updatedUser = await UserModel.update(id, updateData);
  return updatedUser;
};

export const deactivateUser = async (id: number): Promise<UserResponse> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === Role.ADMIN) {
    const adminCount = await UserModel.countByRole(Role.ADMIN);
    if (adminCount <= 1) {
      throw new Error("CANNOT_DEACTIVATE_LAST_ADMIN");
    }
  }

  return await UserModel.update(id, { isActive: false });
};

export const activateUser = async (id: number): Promise<UserResponse> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return await UserModel.update(id, { isActive: true });
};

export const deleteUser = async (id: number): Promise<void> => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === Role.ADMIN) {
    const adminCount = await UserModel.countByRole(Role.ADMIN);
    if (adminCount <= 1) {
      throw new Error("CANNOT_DELETE_LAST_ADMIN");
    }
  }

  await UserModel.delete(id);
};

export const searchUsers = async (query: string): Promise<UserResponse[]> => {
  if (!query || query.trim().length === 0) {
    return await UserModel.findAll();
  }
  return await UserModel.search(query.trim());
};

export const getActiveUsers = async (): Promise<UserResponse[]> => {
  return await UserModel.findAllActive();
};
