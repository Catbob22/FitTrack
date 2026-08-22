import { UserManager } from "oidc-client-ts";

const cognitoAuthConfig = {
    authority: "https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_NouIhTUn7",
    client_id: "3ecm9l537qks4g346dffsnopkt",
    redirect_uri: window.location.origin + "/index.html",
    response_type: "code",
    scope: "email openid"
};

// create a UserManager instance
export const userManager = new UserManager({
    ...cognitoAuthConfig,
});

export async function signOutRedirect() {
    await userManager.removeUser();

    const clientId = "3ecm9l537qks4g346dffsnopkt";
    const logoutUri = window.location.origin + "/index.html";
    const cognitoDomain = "https://ap-southeast-1nouihtun7.auth.ap-southeast-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};