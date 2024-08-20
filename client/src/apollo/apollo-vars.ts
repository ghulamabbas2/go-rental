import { makeVar } from "@apollo/client";
import { IUser } from "@go-rental/shared";

export const isAuthenticatedVar = makeVar<boolean>(false);
export const userVar = makeVar<IUser | null>(null);
export const isLoadingVar = makeVar<boolean>(true);
