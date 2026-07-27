export const dynamic = "force-dynamic";

export function GET(): Response {
  return Response.json(
    {
      status: "ok",
      service: "vitrine",
      check: "liveness",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
