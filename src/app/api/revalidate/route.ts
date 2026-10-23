import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { env } from '@/config/env';
import type {
  RevalidateErrorResponse,
  RevalidateRequestBody,
  RevalidateSuccessResponse
} from '@/types/revalidate';

export async function POST(request: Request): Promise<NextResponse> {
  const secret = env.REVALIDATE_SECRET;
  if (!secret) {
    const body: RevalidateErrorResponse = {
      revalidated: false,
      message: 'Revalidation is not configured'
    };
    return NextResponse.json(body, { status: 503 });
  }

  let payload: RevalidateRequestBody;
  try {
    payload = (await request.json()) as RevalidateRequestBody;
  } catch {
    const body: RevalidateErrorResponse = {
      revalidated: false,
      message: 'Invalid JSON body'
    };
    return NextResponse.json(body, { status: 400 });
  }

  if (payload.secret !== secret) {
    const body: RevalidateErrorResponse = {
      revalidated: false,
      message: 'Invalid secret'
    };
    return NextResponse.json(body, { status: 401 });
  }

  const tags = Array.isArray(payload.tags)
    ? payload.tags.filter((tag): tag is string => typeof tag === 'string' && tag.length > 0)
    : [];

  if (tags.length === 0) {
    const body: RevalidateErrorResponse = {
      revalidated: false,
      message: 'tags required'
    };
    return NextResponse.json(body, { status: 400 });
  }

  for (const tag of tags) {
    revalidateTag(tag, 'max');
  }

  const body: RevalidateSuccessResponse = { revalidated: true, tags };
  return NextResponse.json(body);
}
