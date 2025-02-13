import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { depensesApi } from "../../../services/api";

// Thunks
export const fetchDepenses = createAsyncThunk(
  "depenses/fetchDepenses",
  async () => {
    const response = await depensesApi.getAllDepenses();
    return response.data;
  }
);

export const addDepense = createAsyncThunk(
  "depenses/addDepense",
  async (depenseData) => {
    const formData = new FormData();
    Object.keys(depenseData).forEach((key) => {
      if (key === "pieceJustificative" && depenseData[key]) {
        formData.append(key, {
          uri: depenseData[key].uri,
          type: depenseData[key].type,
          name: depenseData[key].name,
        });
      } else {
        formData.append(key, depenseData[key]);
      }
    });

    const response = await depensesApi.createDepense(formData);
    return response.data;
  }
);

export const updateDepense = createAsyncThunk(
  "depenses/updateDepense",
  async ({ id, depenseData }) => {
    const formData = new FormData();
    Object.keys(depenseData).forEach((key) => {
      if (key === "pieceJustificative" && depenseData[key]) {
        formData.append(key, {
          uri: depenseData[key].uri,
          type: depenseData[key].type,
          name: depenseData[key].name,
        });
      } else {
        formData.append(key, depenseData[key]);
      }
    });

    const response = await depensesApi.updateDepense(id, formData);
    return response.data;
  }
);

export const deleteDepense = createAsyncThunk(
  "depenses/deleteDepense",
  async (id) => {
    await depensesApi.deleteDepense(id);
    return id;
  }
);

const depensesSlice = createSlice({
  name: "depenses",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Depenses
      .addCase(fetchDepenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDepenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDepenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add Depense
      .addCase(addDepense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Depense
      .addCase(updateDepense.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Depense
      .addCase(deleteDepense.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default depensesSlice.reducer;
