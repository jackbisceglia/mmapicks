import { generateFromEmail as gen } from "unique-username-generator";
import { prisma } from "../server/db/client";

const nameToCamelCase = (name: string) =>
  name
    .split(" ")
    .map((word) => word.toLowerCase())
    .join("");

const assertUsernameUnique = async (username: string) => {
  const usernameFromDB = await prisma.user.findUnique({
    where: { username },
  });

  return !usernameFromDB;
};

const recursiveGenerateUsername = async (
  providerName: string,
  lastGeneratedName: string
) => {
  if (await assertUsernameUnique(lastGeneratedName)) {
    return lastGeneratedName;
  }

  recursiveGenerateUsername(providerName, gen(providerName));
};

const generateUsername = async (providerName: string) => {
  // first try to conver1t providerName to camelCase
  return (await recursiveGenerateUsername(
    providerName,
    nameToCamelCase(providerName)
  )) as string;
};
export default generateUsername;
