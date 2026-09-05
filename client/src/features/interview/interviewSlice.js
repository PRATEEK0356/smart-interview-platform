import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createSessionApi,
  getSessionByIdApi,
  submitAnswerApi,
  completeSessionApi,
} from '../../api/sessionApi';

export const startNewSession = createAsyncThunk(
  'interview/startNewSession',
  async (sessionConfig, { rejectWithValue }) => {
    try {
      const data = await createSessionApi(sessionConfig);
      return data.session;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to start interview session.');
    }
  }
);

export const fetchSession = createAsyncThunk(
  'interview/fetchSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const data = await getSessionByIdApi(sessionId);
      return data.session;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch interview session.');
    }
  }
);

export const submitQuestionAnswer = createAsyncThunk(
  'interview/submitQuestionAnswer',
  async ({ sessionId, questionIndex, answerText, visualMetrics }, { rejectWithValue }) => {
    try {
      const data = await submitAnswerApi(sessionId, { questionIndex, answerText, visualMetrics });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit answer.');
    }
  }
);

export const finishSession = createAsyncThunk(
  'interview/finishSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const data = await completeSessionApi(sessionId);
      return data.session;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to complete session.');
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState: {
    activeSession: null,
    currentQuestionIndex: 0,
    lastEvaluation: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
  },
  reducers: {
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
      state.lastEvaluation = null;
    },
    resetInterviewState: (state) => {
      state.activeSession = null;
      state.currentQuestionIndex = 0;
      state.lastEvaluation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Session
      .addCase(startNewSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startNewSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSession = action.payload;
        state.currentQuestionIndex = 0;
        state.lastEvaluation = null;
      })
      .addCase(startNewSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Session
      .addCase(fetchSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeSession = action.payload;
        const unansweredIdx = action.payload.questions.findIndex(q => q.score === null);
        state.currentQuestionIndex = unansweredIdx >= 0 ? unansweredIdx : 0;
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Submit Answer
      .addCase(submitQuestionAnswer.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitQuestionAnswer.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.activeSession = action.payload.session;
        state.lastEvaluation = action.payload.evaluation;
      })
      .addCase(submitQuestionAnswer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Finish Session
      .addCase(finishSession.fulfilled, (state, action) => {
        state.activeSession = action.payload;
      });
  },
});

export const { setCurrentQuestionIndex, resetInterviewState } = interviewSlice.actions;
export default interviewSlice.reducer;
