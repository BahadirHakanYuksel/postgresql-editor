import { getDatabase } from "@/lib/database";

export async function POST(request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return Response.json(
        {
          success: false,
          error: "Geçerli bir SQL sorgusu girin",
        },
        { status: 400 }
      );
    }

    const db = getDatabase();
    const startTime = Date.now();
    const result = db.executeQuery(query);
    const executionTime = Date.now() - startTime;

    return Response.json({
      ...result,
      executionTime,
    });
  } catch (error) {
    console.error("Query execution error:", error);
    return Response.json(
      {
        success: false,
        error: "Sorgu çalıştırılırken bir hata oluştu: " + error.message,
      },
      { status: 500 }
    );
  }
}
