import { create } from "zustand";
import { milkingApi } from "../services/api";
import { MilkingSession, CreateMilkingSessionDTO } from "../types/milking";

// API returns sessions in snake_case. Define a local type for that shape.

interface MilkingState {
  sessions: MilkingSession[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  fetchSessions: (page?: number) => Promise<void>;
  createSession: (session: CreateMilkingSessionDTO) => Promise<void>;
}

export const useMilkingStore = create<MilkingState>((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  total: 0,

  // Fetch all sessions
  fetchSessions: async (page = 1) => {
    try {
      set({ isLoading: true, error: null });

      // Fetch from API (returns { sessions, total, currentPage, totalPages })
      const data = await milkingApi.getSessions(page);

      const sessionsData = data.sessions || [];

      // Transform API snake_case into frontend camelCase MilkingSession
      const transformedSessions: MilkingSession[] = sessionsData.map((session: any) => ({
        id: session.id,
        startTime: session.start_time,
        endTime: session.end_time,
        duration: session.duration,
        milkCollected: session.milk_quantity,
        createdAt: session.created_at,
      }));

      set({
        sessions: transformedSessions,
        currentPage: data.currentPage || page,
        totalPages: data.totalPages || 1,
        total: data.total || 0,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch sessions";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new session
  createSession: async (sessionData: CreateMilkingSessionDTO) => {
    try {
      set({ isLoading: true, error: null });

      // Transform frontend DTO to backend schema
      const payload = {
        start_time: sessionData.startTime,
        end_time: sessionData.endTime,
        duration: sessionData.duration,
        milk_quantity: sessionData.milkCollected,
      };

      await milkingApi.createSession(payload);

      // Refresh session list
      const { fetchSessions } = get();
      await fetchSessions();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create session";
      set({ error: message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
