import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api";

// Define async thunks

// Admin Login
export const adminlogin = createAsyncThunk(
  "admin/login",
  async ({ formValue, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.adminlogin(formValue);
      toast.success("Login Successfully");
      console.log("responseData",response)
      localStorage.setItem("profile", JSON.stringify(response.data));
      navigate("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch Admin Category List
export const adminCategoryList = createAsyncThunk(
  "admin/adminCategoryList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.adminCategoryList();
      const packageWithIds = response.data.map((category, index) => ({
        ...category,
        id: index + 1,
      }));
      return packageWithIds;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Admin Delete Category
export const adminDeleteCategory = createAsyncThunk(
  "admin/adminDeleteCategory",
  async ({ _id, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.adminDeletecategory(_id);
      toast.success("Category deleted successfully");
      navigate("/admin/Category");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Admin Block User
export const adminBlockUser = createAsyncThunk(
  "admin/adminBlockUser",
  async ({ email, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.adminBlockUser(email);
      toast.success("Blocked Successfully");
      navigate("/admin/users");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Admin Unblock User
export const adminUnblockUser = createAsyncThunk(
  "admin/adminUnblockUser",
  async ({ email, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await api.adminUnblockUser(email);
      toast.success("Unblocked Successfully");
      navigate("/admin/users");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Fetch Admin Users
// export const fetchAdminUsers = createAsyncThunk(
//   "admin/fetchAdminUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.adminUsers();
//       const usersWithIds = response.data.map((user, index) => ({
//         ...user,
//         id: user.id,
//       }));
//       return usersWithIds;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );



export const fetchAdminUsers = createAsyncThunk(
    'admin/fetchAdminUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.adminUsers();
            const usersWithIds = response.data.map((user, index) => ({
                ...user,
                id: user.id,
            }));
            return usersWithIds;
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // Unauthorized error, admin not logged in
                throw new Error('Admin not logged in');
            }
            return rejectWithValue(err.response.data);
        }
    }
);


//Admin Delete Packege
export const adminDeletePackage = createAsyncThunk("admin/adminDeletePackage", async ({_id,toast}, { rejectWithValue }) => {
  try {
      console.log("idddd"+_id)
      const response = await api.adminDeletePackage(_id)
      toast.success("package deleted successfully")
      return response.data
  } catch (err) {
      return rejectWithValue(err.response.data);
  }
})

export const adminBooking = createAsyncThunk("admin/adminBooking", async (_, { rejectWithValue }) => {
  try {
      const response = await api.adminBooking();

      
      const packageWithIds = response.data.map((booking, index) => ({
          ...booking,
          id: index + 1,
          // date: format(new Date(booking.bookin), 'yyyy-MM-dd'),

      }));

      return packageWithIds;
  } catch (err) {
      return rejectWithValue(err.response.data);
  }
})

export const adminBookingstatus = createAsyncThunk("admin/adminBookingstatus", async ({id,status}, { rejectWithValue }) => {
  try {
      
      const response = await api.adminBookingstatus({id,status})
     
      return response.data
  } catch (err) {
      return rejectWithValue(err.response.data);
  }
})

// Define the admin slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    admin: null,
    categories: [],
    users: [],
    bookings:[],
    approvalStatus: {} ,
    bookingstatus:{},
    error: "",
    loading: false,
  },
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setLogout: (state, action) => {
      localStorage.clear();
      state.admin = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminlogin.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(adminlogin.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
        state.admin = action.payload;
      })
      .addCase(adminlogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(adminCategoryList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(adminCategoryList.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem(
          "getcategoryprofile",
          JSON.stringify({ ...action.payload })
        );
        state.categories = action.payload;
      })
      .addCase(adminCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(adminDeleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDeleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem(
          "getblockeduser",
          JSON.stringify({ ...action.payload })
        );
        // Update the state based on your logic for deleting a category
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload._id
        );
      })
      .addCase(adminDeleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(adminBlockUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminBlockUser.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem(
          "getblockeduser",
          JSON.stringify({ ...action.payload })
        );
        // Update the state based on your logic for blocking a user
        const user = state.users.find(
          (user) => user.email === action.payload.email
        );
        if (user) {
          user.status = true; // Update status to blocked
        }
      })
      .addCase(adminBlockUser.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(adminUnblockUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminUnblockUser.fulfilled, (state, action) => {
        state.loading = false;
        localStorage.setItem(
          "getunblockeduser",
          JSON.stringify({ ...action.payload })
        );
        // Update the state based on your logic for unblocking a user
        const user = state.users.find(
          (user) => user.email === action.payload.email
        );
        if (user) {
          user.status = false; // Update status to unblocked
        }
      })
      .addCase(adminUnblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        localStorage.setItem(
          "getuserprofile",
          JSON.stringify({ ...action.payload })
        );
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(adminDeletePackage.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminDeletePackage.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        
        // Filter out the deleted package from the 'tours' array
        state.tours = state.tours.filter((item) => item._id !== deletedId);

        // Set the error to null since the operation succeeded
        state.error = null;
      })
      .addCase(adminDeletePackage.rejected, (state, action) => {
        state.loading = false;
        // Handle any error or state changes for rejected case here
      })
      .addCase(adminBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminBooking.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.bookings = action.payload;
      })
      .addCase(adminBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(adminBookingstatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(adminBookingstatus.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.bookingstatus = action.payload;
      })
      .addCase(adminBookingstatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

  },
});

export const { setAdmin, setLogout } = adminSlice.actions;
export default adminSlice.reducer;
