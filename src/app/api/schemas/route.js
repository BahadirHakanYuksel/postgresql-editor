import { getDatabase } from "@/lib/database";

export async function GET() {
  try {
    const db = getDatabase();
    const tables = db.getTables();

    const schemas = {};

    tables.forEach((tableName) => {
      const schema = db.getTableSchema(tableName);
      const data = db.getTableData(tableName);

      schemas[tableName] = {
        schema,
        sampleData: data.slice(0, 3), // İlk 3 satır örnek
        rowCount: data.length,
        columns: Object.keys(schema || {}),
        relations: detectTableRelations(tableName, schema, tables),
      };
    });

    return Response.json({
      success: true,
      schemas,
      tableCount: tables.length,
    });
  } catch (error) {
    console.error("Schemas fetch error:", error);
    return Response.json(
      {
        success: false,
        error: "Şema bilgileri alınırken bir hata oluştu: " + error.message,
      },
      { status: 500 }
    );
  }
}

// Tablo ilişkilerini tespit et
function detectTableRelations(tableName, schema, allTables) {
  const relations = [];

  if (!schema) return relations;

  Object.entries(schema).forEach(([columnName, columnInfo]) => {
    // Foreign key detection
    if (columnName.endsWith("_id") && columnName !== "id") {
      const referencedTable = columnName.replace("_id", "s");
      if (allTables.includes(referencedTable)) {
        relations.push({
          type: "FOREIGN_KEY",
          from: `${tableName}.${columnName}`,
          to: `${referencedTable}.id`,
          relationshipType: "MANY_TO_ONE",
        });
      }
    }

    // Primary key detection
    if (columnInfo.primaryKey) {
      relations.push({
        type: "PRIMARY_KEY",
        column: `${tableName}.${columnName}`,
        relationshipType: "UNIQUE",
      });
    }
  });

  return relations;
}
