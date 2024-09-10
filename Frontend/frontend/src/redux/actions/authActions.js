import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:8000/api/signup/", {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: "Network error" });
    }
  }
);


export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (loginData, { rejectWithValue }) => {
      try {
        const response = await axios.post("http://localhost:8000/api/login/", loginData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  export const clearError = () => ({
    type: 'auth/clearError',
  });