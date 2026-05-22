import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

let _handler: { GET: Function; POST: Function; PUT: Function } | null = null;

async function getHandler() {
  if (!_handler) {
    const { serve } = await import("inngest/next");
    const { inngest } = await import("@/lib/inngest/client");
    const { scrapeEvents } = await import("@/lib/inngest/functions");
    _handler = serve({ client: inngest, functions: [scrapeEvents] });
  }
  return _handler!;
}

export async function GET(req: NextRequest) {
  const h = await getHandler();
  return h.GET(req);
}

export async function POST(req: NextRequest) {
  const h = await getHandler();
  return h.POST(req);
}

export async function PUT(req: NextRequest) {
  const h = await getHandler();
  return h.PUT(req);
}
