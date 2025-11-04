import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo")) : null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      // simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (credentials.email === "admin@test.com" && credentials.password === "123456") {
        const user = { email: credentials.email, name: "Admin User", userRole: "super_admin" };
        
        Cookies.set("userInfo", JSON.stringify(user), { expires: 7 });
        
        return user;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      Cookies.remove("userInfo"); 
      sessionStorage.removeItem("user");  
      sessionStorage.removeItem("pendingBusinessData");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
