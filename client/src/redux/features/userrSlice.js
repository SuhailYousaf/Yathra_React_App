import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";
import { toast } from "react-toastify";

// Async thunk for user login
export const usersignIn = createAsyncThunk("userr/login", async ({ formValue, navigate }, { rejectWithValue }) => {
  try {
    const response = await api.usersignIn(formValue);
    toast.success("Login Successfully");
    console.log("responseData",response.data)
    localStorage.setItem("userprofile", JSON.stringify(response.data));
    navigate("/");
    return response.data;
  } catch (err) {
    toast.error(err.response.data.message);
    return rejectWithValue(err.response.data);
  }
});

// Async thunk for user registration
export const userregister = createAsyncThunk("userr/register", async ({ formValue, navigate }, { rejectWithValue }) => {
  try {
    const response = await api.userregister(formValue);
    toast.success("Register Successfully");
    localStorage.setItem("userprofile", JSON.stringify(response.data));
    navigate("/");
    return response.data;
  } catch (err) {
    toast.error(err.response.data.message);
    return rejectWithValue(err.response.data);
  }
});

// Async thunk for getting user list
export const getUsers = createAsyncThunk("userr/getUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.getUsers();
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

const userrSlice = createSlice({
  name: "userr",
  initialState: {
    user: JSON.parse(localStorage.getItem("userprofile")) || null,
    users: [],
    error: "",
    loading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLogout: (state) => {
      localStorage.removeItem("userprofile");
      state.user = null;
    },
  },
  extraReducers: {
    [usersignIn.pending]: (state) => {
      state.loading = true;
    },
    [usersignIn.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [usersignIn.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [userregister.pending]: (state) => {
      state.loading = true;
    },
    [userregister.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [userregister.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
    [getUsers.pending]: (state) => {
      state.loading = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },
  },
});

export const { setUser, setLogout } = userrSlice.actions;

export default userrSlice.reducer;
