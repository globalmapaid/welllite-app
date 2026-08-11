import http from '../http';
import type { CreateWellRequest } from './wells';

export interface SyncReadingItem {
  client_uuid: string;
  well_client_uuid: string;
  swl_metres: number;
  measured_on: string;
}

export interface SyncBatchRequest {
  wells: CreateWellRequest[];
  readings: SyncReadingItem[];
}

export type SyncItemStatus = 'created' | 'duplicate' | 'rejected';

export interface SyncItemResult {
  client_uuid: string;
  status: SyncItemStatus;
  reason?: string;
}

export interface SyncBatchResponse {
  wells: SyncItemResult[];
  readings: SyncItemResult[];
}

export async function syncBatch(data: SyncBatchRequest): Promise<SyncBatchResponse> {
  const response = await http.post<SyncBatchResponse>('/api/v1/sync/batch', data);
  return response.data;
}
