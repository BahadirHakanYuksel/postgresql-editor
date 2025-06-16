import { getDatabase } from "@/lib/database";

export async function GET() {
  try {
    const db = getDatabase();
    const tables = db.getTables();

    return Response.json({
      success: true,
      tables,
    });
  } catch (error) {
    console.error("Tables fetch error:", error);
    return Response.json(
      {
        success: false,
        error: "Tablolar alınırken bir hata oluştu: " + error.message,
      },
      { status: 500 }
    );
  }
}
