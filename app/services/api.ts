import api from '../lib/axios';

export interface CreateMilkingSessionPayload {
  start_time: string;
  end_time: string;
  duration: number;
  milk_quantity: number;
}

export const milkingApi = {
  createSession: async (payload: CreateMilkingSessionPayload) => {
    const response = await api.post('/sessions', payload);
    return response.data;
  },

  getSessions: async (page: number = 1, limit: number = 10) => {
    // backend supports pagination via query params ?page=&limit=
    const response = await api.get('/sessions', { params: { page, limit } });
    return response.data; // { sessions, total, currentPage, totalPages }
  },
};
