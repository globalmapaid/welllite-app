import http from '../http';

export interface CreateReadingRequest {
  client_uuid: string;
  well_id: string;
  swl_metres: number;
  measured_on: string;
}

export interface Reading {
  id: string;
  well_id: string;
  swl_metres: number;
  measured_on: string;
}

export async function createReading(data: CreateReadingRequest): Promise<Reading> {
  const response = await http.post<Reading>('/api/v1/readings', data);
  return response.data;
}
