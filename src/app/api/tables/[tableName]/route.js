import { getDatabase } from "@/lib/database";

export async function GET(request, { params }) {
  try {
    const { tableName } = params;
    const db = getDatabase();

    const schema = db.getTableSchema(tableName);
    const data = db.getTableData(tableName);

    if (!schema) {
      return Response.json(
        {
          success: false,
          error: `Tablo bulunamadı: ${tableName}`,
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      tableName,
      schema,
      data,
      rowCount: data.length,
    });
  } catch (error) {
    console.error("Table details fetch error:", error);
    return Response.json(
      {
        success: false,
        error: "Tablo detayları alınırken bir hata oluştu: " + error.message,
      },
      { status: 500 }
    );
  }
}
