import Cookies from "js-cookie";

export const getUserFromCookie = () => {
  const userCookie = Cookies.get("userInfo");
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (err) {
      console.error("Failed to parse user cookie:", err);
      return null;
    }
  }
  return null;
};
