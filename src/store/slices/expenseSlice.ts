import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import supabase from '../../config/supabaseClient';

// Define Expense type
export interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  payment_method: string;
  amount: number;
  user_id: string;
}

// Define state type
interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ExpenseState = {
  expenses: [],
  loading: false,
  error: null
};

// ─── Async Actions (API calls) ───────────────────────────────

// Fetch all expenses
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Expense[];
    } catch (err) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Failed to fetch expenses');
    }
  }
);

// Add expense
export const addExpense = createAsyncThunk(
  'expenses/add',
  async (expense: Omit<Expense, 'id'>, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select()
        .single();

      if (error) throw error;
      return data as Expense;
    } catch (err) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Failed to add expense');
    }
  }
);

// Update expense
export const updateExpense = createAsyncThunk(
  'expenses/update',
  async (expense: Expense, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: expense.date,
          payment_method: expense.payment_method
        })
        .eq('id', expense.id)
        .select()
        .single();

      if (error) throw error;
      return data as Expense;
    } catch (err) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Failed to update expense');
    }
  }
);

// Delete expense
export const deleteExpense = createAsyncThunk(
  'expenses/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    } catch (err) {
      if (err instanceof Error) return rejectWithValue(err.message);
      return rejectWithValue('Failed to delete expense');
    }
  }
);

// ─── Slice ───────────────────────────────────────────────────

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch expenses
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action: PayloadAction<Expense[]>) => {
        state.loading = false;
        state.expenses = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Add expense
    builder
      .addCase(addExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        state.loading = false;
        state.expenses.unshift(action.payload); // ← Add to top of list
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Update expense
    builder
      .addCase(updateExpense.fulfilled, (state, action: PayloadAction<Expense>) => {
        const index = state.expenses.findIndex(exp => exp.id === action.payload.id);
        if (index !== -1) {
          state.expenses[index] = action.payload; // ← Replace updated expense
        }
      })

    // Delete expense
    builder
      .addCase(deleteExpense.fulfilled, (state, action: PayloadAction<string>) => {
        state.expenses = state.expenses.filter(exp => exp.id !== action.payload);
      })
  }
});

export const { clearError } = expenseSlice.actions;
export default expenseSlice.reducer;