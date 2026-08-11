import http from '../http';

export interface Well {
  id: string;
  client_id: string;
  client_uuid: string;
  created_by: string;
  latitude: number;
  longitude: number;
  well_confirmed: boolean;
  name: string | null;
  well_type: string | null;
  well_status: string | null;
  daily_users_estimate: number | null;
  distance_to_other_water_km: string | null;
  opening_diameter_cm: string | null;
  owner_name: string | null;
  owner_mobile: string | null;
  comments: string | null;
  review_status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface WellSearchBounds {
  minLat: number;
  minLon: number;
  maxLat: number;
  maxLon: number;
}

export interface SearchWellsResponse {
  items: Well[];
  truncated: boolean;
}

export async function searchWells(
  bounds: WellSearchBounds,
  options?: { reviewStatus?: string; limit?: number; signal?: AbortSignal },
): Promise<SearchWellsResponse> {
  const response = await http.get<SearchWellsResponse>('/api/v1/wells/search', {
    params: {
      min_lat: bounds.minLat,
      min_lon: bounds.minLon,
      max_lat: bounds.maxLat,
      max_lon: bounds.maxLon,
      review_status: options?.reviewStatus,
      limit: options?.limit,
    },
    signal: options?.signal,
  });
  return response.data;
}

export async function getWellById(id: string): Promise<Well> {
  const response = await http.get<Well>(`/api/v1/wells/${id}`);
  return response.data;
}

export interface CreateWellRequest {
  client_uuid: string;
  latitude: number;
  longitude: number;
  well_confirmed: boolean;
  name: string;
  well_type: string;
  well_status: string;
  daily_users_estimate?: number;
  distance_to_other_water_km?: number;
  opening_diameter_cm?: number;
  owner_name?: string;
  owner_mobile?: string;
  comments?: string;
}

export async function createWell(data: CreateWellRequest): Promise<Well> {
  const response = await http.post<Well>('/api/v1/wells', data);
  return response.data;
}
