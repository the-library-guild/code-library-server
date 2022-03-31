// https://blog.logrocket.com/handling-graphql-errors-like-a-champ-with-unions-and-interfaces/

import { ApolloError } from "apollo-server-express";

import { Perm, hasPerms } from "code-library-perms";

async function handleErrs(func: any) {
  try {
    return await func();
  } catch (err) {
    const { message: msg, extensions } = err;

    if (extensions == null)
      console.error(`[Server][GraphQl] An Unexpected Error Occured: ${err}`);

    const { code, ...rest } = extensions;

    console.error(`[Server][GraphQl][${code}] ${msg}`);

    return code
      ? { __typename: code, msg, ...rest }
      : {
          __typename: "Error",
          msg: "An Unexpected Error Occured. Please Post this Message along with a Description of What you were trying to do at https://github.com/LinusBolls/code-library-server/issues/",
        };
  }
}
const keyByValue = (obj: { [key: string]: any }, value: any) =>
  Object.entries(obj)
    .filter(([key, _]) => obj[key] === value)
    .map(([key, _]) => key)[0];

function requirePerms(userPermsInt: number, requiredPermsInt: number) {
  if (!hasPerms(userPermsInt, requiredPermsInt))
    throw new ApolloError(
      `Missing Permission: ${keyByValue(Perm, requiredPermsInt)}`,
      "MissingPermissionsError"
    );
}
export { handleErrs, requirePerms };
