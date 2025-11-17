import { TypeInput } from "supertokens-node/types";
import EmailPasswordNode from "supertokens-node/recipe/emailpassword";
import SessionNode from "supertokens-node/recipe/session";

export const backendConfig: TypeInput = {
  framework: "express",
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
    apiKey: process.env.SUPERTOKENS_API_KEY!,
  },
  appInfo: {
    appName: "Uniform Management",
    apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN!,
    websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN!,
    apiBasePath: "/auth",
  },
  recipeList: [EmailPasswordNode.init(), SessionNode.init()],
};
