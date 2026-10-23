export interface RevalidateRequestBody {
  secret?: string;
  tags?: string[];
}

export interface RevalidateSuccessResponse {
  revalidated: true;
  tags: string[];
}

export interface RevalidateErrorResponse {
  revalidated: false;
  message: string;
}
