import { api } from "./client";

export const getUsers = async () => {
  return api.get("/users");
};

export const createUser = async (email) => {
  return api.post("/users", { email });
};
