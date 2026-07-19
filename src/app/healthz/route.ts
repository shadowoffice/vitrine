export function GET() {
  return Response.json({
    status: "ok",
    service: "vitrine",
    timestamp: new Date().toISOString(),
  });
}
