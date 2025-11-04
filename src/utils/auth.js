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

export const getSession = () => {
  try {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error("Failed to parse session user:", err);
    return null;
  }
};
