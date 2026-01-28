import {
  createUser as createUserModel,
  findAllUsers,
  findUserById,
  updateUser as updateUserModel,
  deleteUser as deleteUserModel,
  existsByEmail,
  countUsersByRole,
  searchUsers as searchUsersModel,
  findAllActiveUsers,
} from "@/models/user";
import {
  CreateUserInput,
  UpdateUserInput,
  UserResponse,
  SearchUserQuery,
} from "@/schemas/user";
import { hashPassword } from "@/utils/hashPassword";
import { Role } from "@/generated/prisma";

export const createUser = async (
  data: CreateUserInput
): Promise<UserResponse> => {
  const emailExists = await existsByEmail(data.email);
  if (emailExists) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await createUserModel({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  return await findAllUsers();
};

export const getUserById = async (id: number): Promise<UserResponse> => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

export const getActiveUsers = async (): Promise<UserResponse[]> => {
  return await findAllActiveUsers();
};

export const searchUsers = async (
  filters: SearchUserQuery
): Promise<UserResponse[]> => {
  if (!filters.q && !filters.role && filters.isActive === undefined) {
    return await findAllUsers();
  }

  return await searchUsersModel(filters);
};

export const updateUser = async (
  id: number,
  data: UpdateUserInput
): Promise<UserResponse> => {
  const existingUser = await findUserById(id);
  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (data.email && data.email !== existingUser.email) {
    const emailExists = await existsByEmail(data.email);
    if (emailExists) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
  }

  const updateData: UpdateUserInput = { ...data };
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const updatedUser = await updateUserModel(id, updateData);
  return updatedUser;
};

export const deactivateUser = async (id: number): Promise<UserResponse> => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === Role.ADMIN) {
    const adminCount = await countUsersByRole(Role.ADMIN);
    if (adminCount <= 1) {
      throw new Error("CANNOT_DEACTIVATE_LAST_ADMIN");
    }
  }

  return await updateUserModel(id, { isActive: false });
};

export const activateUser = async (id: number): Promise<UserResponse> => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return await updateUserModel(id, { isActive: true });
};

export const deleteUser = async (id: number): Promise<void> => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Prevent deleting the last admin
  if (user.role === Role.ADMIN) {
    const adminCount = await countUsersByRole(Role.ADMIN);
    if (adminCount <= 1) {
      throw new Error("CANNOT_DELETE_LAST_ADMIN");
    }
  }

  await deleteUserModel(id);
};
