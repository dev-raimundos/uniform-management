import { SuperTokensConfig } from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

export const supertokensConfig: SuperTokensConfig = {
  appInfo: {
    appName: "Uniform Management",
    apiDomain: process.env.NEXT_PUBLIC_API_DOMAIN!,
    websiteDomain: process.env.NEXT_PUBLIC_WEBSITE_DOMAIN!,
    apiBasePath: "/auth",
  },
  recipeList: [EmailPassword.init(), Session.init()],
};
