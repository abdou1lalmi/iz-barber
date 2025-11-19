export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const BARBER_NAME = "IZ BARBER";
export const BARBER_TAGLINE = "Premium Cuts, Expert Hands";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "💈 IZ BARBER 💈";

export const SITE_SUBTITLE = "Book Your Perfect Cut Today";

// Professional barber logo - using scissors emoji with styling
export const APP_LOGO = "💈";

// Barber shop details
export const BARBER_LOCATION = "123 Main Street, Your City";
export const BARBER_PHONE = "(555) 123-4567";
export const BARBER_EMAIL = "hello@izbarber.com";
export const BARBER_HOURS = "Mon-Fri: 9AM-6PM | Sat: 9AM-5PM | Sun: Closed";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
