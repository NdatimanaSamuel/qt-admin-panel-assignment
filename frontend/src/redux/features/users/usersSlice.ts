import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./usersServices";
import type { UserData, UserResponse } from "./usersServices";

// Get user from local storage safely
const storedUser = localStorage.getItem("user");
const user: UserResponse | null = storedUser ? JSON.parse(storedUser) : null;

export interface UserState {
  user: UserResponse | null;
  users: UserResponse[];
  register: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
  };
    weeklyStats: { data: { day: string; count: number }[]; isLoading: boolean };
  fetch: {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    message: string;
  };
}

 export const initialState: UserState = {
  user,
  users: [],
  register: { isLoading: false, isSuccess: false, isError: false, message: "" },
  fetch: { isLoading: false, isSuccess: false, isError: false, message: "" },
    weeklyStats: { data: [], isLoading: false },
};

// Register User
export const registerUser = createAsyncThunk<
  UserResponse,
  UserData,
  { rejectValue: string }
>("auth/register", async (user, thunkApi) => {
  try {
    return await userService.register(user);
  } catch (error: any) {
    let message = "An unexpected error occurred";

    if (error.response?.data?.message) {
      const backendMessage = error.response.data.message;
      message = Array.isArray(backendMessage)
        ? backendMessage.join(", ") // 👈 join multiple errors into one string
        : backendMessage;
    } else if (error.message) {
      message = error.message;
    }

    return thunkApi.rejectWithValue(message);
  }
});


// Fetch All Users
export const fetchUsers = createAsyncThunk<
  UserResponse[],
  void,
  { rejectValue: string }
>("users/fetchAll", async (_, thunkAPI) => {
  try {
    return await userService.getAllUsersProtobuf();
  } catch (error: any) {
    const message =
      (error.response?.data?.message as string) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Fetch Single User
export const fetchSingleUser = createAsyncThunk<
  UserResponse,
  number,
  { rejectValue: string }
>("users/fetchSingle", async (userId, thunkAPI) => {
  try {
    return await userService.getSingleUser(userId);
  } catch (error: any) {
    const message =
      (error.response?.data?.message as string) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Update User
  export const updateUser = createAsyncThunk<
    { data: UserResponse; message: string }, // 👈 fix this type
    { userId: number; updatedData: Partial<UserData> },
    { rejectValue: string }
  >("users/update", async ({ userId, updatedData }, thunkAPI) => {
    try {
      return await userService.updateUser(userId, updatedData);
    } catch (error: any) {
      const message =
        (error.response?.data?.message as string) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  });

  // ✅ Delete User
export const deleteUser = createAsyncThunk<
  { message: string },
  number,
  { rejectValue: string }
>("users/delete", async (userId, thunkAPI) => {
  try {
    return await userService.deleteUser(userId);
  } catch (error: any) {
    const message =
      (error.response?.data?.message as string) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// ✅ Fetch weekly user stats
export const fetchWeeklyUserStats = createAsyncThunk<
  { day: string; count: number }[],
  void,
  { rejectValue: string }
>("users/fetchWeeklyUserStats", async (_, thunkAPI) => {
  try {
    return await userService.getWeeklyUserStats();
  } catch (error: any) {
    const message =
      (error.response?.data?.message as string) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});



const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRegister: (state) => {
      state.register = { isLoading: false, isSuccess: false, isError: false, message: "" };
    },
    resetFetch: (state) => {
      state.fetch = { isLoading: false, isSuccess: false, isError: false, message: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.register.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.register.isLoading = false;
        state.register.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.register.isLoading = false;
        state.register.isError = true;
        state.register.message = action.payload ?? "Something went wrong";
        state.user = null;
      })

      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.fetch.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.fetch.isLoading = false;
        state.fetch.isSuccess = true;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.fetch.isLoading = false;
        state.fetch.isError = true;
        state.fetch.message = action.payload ?? "Failed to fetch users";
      })

      .addCase(fetchSingleUser.pending, (state) => {
        state.fetch.isLoading = true;
      })

      .addCase(fetchSingleUser.fulfilled, (state, action) => {
      state.fetch.isLoading = false;
      state.fetch.isSuccess = true;
      state.user = action.payload;
    })
    .addCase(fetchSingleUser.rejected, (state, action) => {
    state.fetch.isLoading = false;
    state.fetch.isError = true;
    state.fetch.message = action.payload ?? "Failed to fetch user";
  })
 
  .addCase(updateUser.pending, (state) => {
  state.register.isLoading = true;
})
.addCase(updateUser.fulfilled, (state, action) => {
  state.register.isLoading = false;
  state.register.isSuccess = true;
  state.register.message = action.payload.message; // ✅ show backend message
  state.user = action.payload.data;

  // ✅ update user in list
  const updatedUser = action.payload.data;
  const index = state.users.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) state.users[index] = updatedUser;
})
.addCase(updateUser.rejected, (state, action) => {
  state.register.isLoading = false;
  state.register.isError = true;
  state.register.message = action.payload ?? "Failed to update user";
})

.addCase(deleteUser.pending, (state) => {
  state.register.isLoading = true;
})
.addCase(deleteUser.fulfilled, (state, action) => {
  state.register.isLoading = false;
  state.register.isSuccess = true;
  state.register.message = action.payload.message;

  // ✅ remove deleted user from list
  state.users = state.users.filter((u) => Number(u.id) !== (action.meta.arg as number));
})
.addCase(deleteUser.rejected, (state, action) => {
  state.register.isLoading = false;
  state.register.isError = true;
  state.register.message = action.payload ?? "Failed to delete user";
})

.addCase(fetchWeeklyUserStats.pending, (state) => {
  state.weeklyStats.isLoading = true;
})
.addCase(fetchWeeklyUserStats.fulfilled, (state, action) => {
  state.weeklyStats.isLoading = false;
  state.weeklyStats.data = action.payload;
})
.addCase(fetchWeeklyUserStats.rejected, (state) => {
  state.weeklyStats.isLoading = false;
});


  },
});

export const { resetRegister, resetFetch } = userSlice.actions;
export default userSlice.reducer;
