import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Types
export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface Category {
  id: number;
  name: string;
  questions: Question[];
}

export interface Domain {
  id: number;
  name: string;
  categories: Category[];
}

interface DomainsState {
  domains: Domain[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DomainsState = {
  domains: [],
  status: 'idle',
  error: null,
};

// Async thunks
export const fetchDomains = createAsyncThunk('domains/fetchDomains', async () => {
  const response = await axios.get(`${API_URL}/domains/`);
  console.log('response: ', response);
  return response.data;
});




export const addDomain = createAsyncThunk('domains/addDomain', async (name: string) => {
  const response = await axios.post(`${API_URL}/domains`, { name });
  return response.data;
});

export const updateDomain = createAsyncThunk(
  'domains/updateDomain',
  async ({ id, name }: { id: number; name: string }) => {
    const response = await axios.put(`${API_URL}/domains/${id}`, { name });
    return response.data;
  }
);

export const deleteDomain = createAsyncThunk('domains/deleteDomain', async (id: number) => {
  await axios.delete(`${API_URL}/domains/${id}`);
  return id;
});

export const addCategory = createAsyncThunk(
  'domains/addCategory',
  async ({ domainId, name }: { domainId: number; name: string }) => {
    const response = await axios.post(`${API_URL}/domains/${domainId}/categories`, { name });
    return { domainId, category: response.data };
  }
);

export const updateCategory = createAsyncThunk(
  'domains/updateCategory',
  async ({
    domainId,
    categoryId,
    name,
  }: {
    domainId: number;
    categoryId: number;
    name: string;
  }) => {
    const response = await axios.put(
      `${API_URL}/domains/${domainId}/categories/${categoryId}`,
      { name }
    );
    return { domainId, categoryId, category: response.data };
  }
);

export const deleteCategory = createAsyncThunk(
  'domains/deleteCategory',
  async ({ domainId, categoryId }: { domainId: number; categoryId: number }) => {
    await axios.delete(`${API_URL}/domains/${domainId}/categories/${categoryId}`);
    return { domainId, categoryId };
  }
);

export const addQuestion = createAsyncThunk(
  'domains/addQuestion',
  async ({
    domainId,
    categoryId,
    question,
  }: {
    domainId: number;
    categoryId: number;
    question: Omit<Question, 'id'>;
  }) => {
    const response = await axios.post(
      `${API_URL}/domains/${domainId}/categories/${categoryId}/questions`,
      question
    );
    return { domainId, categoryId, question: response.data };
  }
);

export const updateQuestion = createAsyncThunk(
  'domains/updateQuestion',
  async ({
    domainId,
    categoryId,
    questionId,
    question,
  }: {
    domainId: number;
    categoryId: number;
    questionId: number;
    question: Omit<Question, 'id'>;
  }) => {
    const response = await axios.put(
      `${API_URL}/domains/${domainId}/categories/${categoryId}/questions/${questionId}`,
      question
    );
    return { domainId, categoryId, questionId, question: response.data };
  }
);

export const deleteQuestion = createAsyncThunk(
  'domains/deleteQuestion',
  async ({
    domainId,
    categoryId,
    questionId,
  }: {
    domainId: number;
    categoryId: number;
    questionId: number;
  }) => {
    await axios.delete(
      `${API_URL}/domains/${domainId}/categories/${categoryId}/questions/${questionId}`
    );
    return { domainId, categoryId, questionId };
  }
);

const domainsSlice = createSlice({
  name: 'domains',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch domains
      .addCase(fetchDomains.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDomains.fulfilled, (state, action: PayloadAction<Domain[]>) => {
        state.status = 'succeeded';
        state.domains = action.payload;
      })
      .addCase(fetchDomains.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch domains';
      })
      // Add domain
      .addCase(addDomain.fulfilled, (state, action: PayloadAction<Domain>) => {
        state.domains.push(action.payload);
      })
      // Update domain
      .addCase(updateDomain.fulfilled, (state, action: PayloadAction<Domain>) => {
        const index = state.domains.findIndex((domain) => domain.id === action.payload.id);
        if (index !== -1) {
          state.domains[index] = action.payload;
        }
      })
      // Delete domain
      .addCase(deleteDomain.fulfilled, (state, action: PayloadAction<number>) => {
        state.domains = state.domains.filter((domain) => domain.id !== action.payload);
      })
      // Add category
      .addCase(
        addCategory.fulfilled,
        (state, action: PayloadAction<{ domainId: number; category: Category }>) => {
          const { domainId, category } = action.payload;
          const domainIndex = state.domains.findIndex((domain) => domain.id === domainId);
          if (domainIndex !== -1) {
            state.domains[domainIndex].categories.push(category);
          }
        }
      )
      // Update category
      .addCase(
        updateCategory.fulfilled,
        (
          state,
          action: PayloadAction<{
            domainId: number;
            categoryId: number;
            category: Category;
          }>
        ) => {
          const { domainId, categoryId, category } = action.payload;
          const domainIndex = state.domains.findIndex((domain) => domain.id === domainId);
          if (domainIndex !== -1) {
            const categoryIndex = state.domains[domainIndex].categories.findIndex(
              (cat) => cat.id === categoryId
            );
            if (categoryIndex !== -1) {
              state.domains[domainIndex].categories[categoryIndex] = category;
            }
          }
        }
      )
      // Delete category
      .addCase(
        deleteCategory.fulfilled,
        (state, action: PayloadAction<{ domainId: number; categoryId: number }>) => {
          const { domainId, categoryId } = action.payload;
          const domainIndex = state.domains.findIndex((domain) => domain.id === domainId);
          if (domainIndex !== -1) {
            state.domains[domainIndex].categories = state.domains[domainIndex].categories.filter(
              (category) => category.id !== categoryId
            );
          }
        }
      )
      // Add question
      .addCase(
        addQuestion.fulfilled,
        (
          state,
          action: PayloadAction<{
            domainId: number;
            categoryId: number;
            question: Question;
          }>
        ) => {
          const { domainId, categoryId, question } = action.payload;
          const domainIndex = state.domains.findIndex((domain) => domain.id === domainId);
          if (domainIndex !== -1) {
            const categoryIndex = state.domains[domainIndex].categories.findIndex(
              (category) => category.id === categoryId
            );
            if (categoryIndex !== -1) {
              state.domains[domainIndex].categories[categoryIndex].questions.push(question);
            }
          }
        }
      )
      // Update question
      .addCase(
        updateQuestion.fulfilled,
        (
          state,
          action: PayloadAction<{
            domainId: number;
            categoryId: number;
            questionId: number;
            question: Question;
          }>
        ) => {
          const { domainId, categoryId, questionId, question } = action.payload;
          const domainIndex = state.domains.findIndex((domain) => domain.id === domainId);
          if (domainIndex !== -1) {
            const categoryIndex = state.domains[domainIndex].categories.findIndex(
              (category) => category.id === categoryId
            );
            if (categoryIndex !== -1) {
              const questionIndex = state.domains[domainIndex].categories[
                categoryIndex
              ].questions.findIndex((q) => q.id === questionId);
              if (questionIndex !== -1) {
                state.domains[domainIndex].categories[categoryIndex].questions[questionIndex] =
                  question;
              }
            }
          }
        }
      )
      // Delete question
      .addCase(
        deleteQuestion.fulfilled,
        (
          state,
          action: PayloadAction<{
            domainId: number;
            categoryId: number;
            questionId: number;
          }>
        ) => {
          const { domainId, categoryId, questionId } = action.payload;
          const domainIndex = state.domains.findIndex((domain) => domain.id === domainId);
          if (domainIndex !== -1) {
            const categoryIndex = state.domains[domainIndex].categories.findIndex(
              (category) => category.id === categoryId
            );
            if (categoryIndex !== -1) {
              state.domains[domainIndex].categories[categoryIndex].questions = state.domains[
                domainIndex
              ].categories[categoryIndex].questions.filter(
                (question) => question.id !== questionId
              );
            }
          }
        }
      );
  },
});

export default domainsSlice.reducer;