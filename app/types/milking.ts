export interface MilkingSession {
  id: string;
  startTime: string; // ISO 8601 format
  endTime: string; // ISO 8601 format
  duration: number; // in seconds
  milkCollected: number; // in liters
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMilkingSessionDTO {
  startTime: string;
  endTime: string;
  duration: number;
  milkCollected: number;
}

export interface MilkingSessionResponse {
  success: boolean;
  data?: MilkingSession;
  error?: string;
}

export interface MilkingSessionsListResponse {
  success: boolean;
  data?: MilkingSession[];
  error?: string;
}