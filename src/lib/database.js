// Database configuration
const DB_CONFIG = {
  // In-memory SQLite for demo purposes
  // In production, you would use actual PostgreSQL connection
  type: "memory",
  tables: new Map(),
  data: new Map(),
};

class DatabaseManager {
  constructor() {
    this.tables = new Map();
    this.data = new Map();
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample tables for demonstration
    this.createTable("users", {
      id: { type: "SERIAL", primaryKey: true },
      name: { type: "VARCHAR(100)", nullable: false },
      email: { type: "VARCHAR(100)", unique: true },
      age: { type: "INTEGER" },
      created_at: { type: "TIMESTAMP", default: "NOW()" },
    });

    this.createTable("posts", {
      id: { type: "SERIAL", primaryKey: true },
      user_id: { type: "INTEGER", foreignKey: "users.id" },
      title: { type: "VARCHAR(200)", nullable: false },
      content: { type: "TEXT" },
      created_at: { type: "TIMESTAMP", default: "NOW()" },
    });

    // Sample data
    this.insertData("users", [
      { id: 1, name: "Ahmet Yılmaz", email: "ahmet@example.com", age: 25 },
      { id: 2, name: "Fatma Kaya", email: "fatma@example.com", age: 30 },
      { id: 3, name: "Mehmet Öz", email: "mehmet@example.com", age: 28 },
    ]);

    this.insertData("posts", [
      {
        id: 1,
        user_id: 1,
        title: "İlk Postum",
        content: "Bu benim ilk blog postum.",
      },
      {
        id: 2,
        user_id: 1,
        title: "SQL Öğreniyorum",
        content: "PostgreSQL çok güçlü bir veritabanı.",
      },
      {
        id: 3,
        user_id: 2,
        title: "Web Geliştirme",
        content: "Next.js ile harika projeler yapabiliyoruz.",
      },
    ]);
  }

  createTable(tableName, schema) {
    this.tables.set(tableName, schema);
    this.data.set(tableName, []);
    return true;
  }

  dropTable(tableName) {
    this.tables.delete(tableName);
    this.data.delete(tableName);
    return true;
  }

  insertData(tableName, rows) {
    if (!this.data.has(tableName)) return false;
    const currentData = this.data.get(tableName);
    if (Array.isArray(rows)) {
      currentData.push(...rows);
    } else {
      currentData.push(rows);
    }
    return true;
  }

  getTables() {
    return Array.from(this.tables.keys());
  }

  getTableSchema(tableName) {
    return this.tables.get(tableName);
  }
  getTableData(tableName) {
    return this.data.get(tableName) || [];
  }

  // Tablo ilişkilerini analiz et
  getTableRelations(tableName) {
    const schema = this.getTableSchema(tableName);
    if (!schema) return [];

    const relations = [];
    const allTables = this.getTables();

    Object.entries(schema).forEach(([columnName, columnInfo]) => {
      // Foreign key ilişkileri
      if (columnInfo.foreignKey) {
        const [refTable, refColumn] = columnInfo.foreignKey.split(".");
        relations.push({
          type: "FOREIGN_KEY",
          from: `${tableName}.${columnName}`,
          to: `${refTable}.${refColumn}`,
          relationshipType: "MANY_TO_ONE",
          description: `${tableName} tablosundaki ${columnName} sütunu ${refTable} tablosundaki ${refColumn} sütununa referans verir`,
        });
      }

      // _id ile biten sütunlar için otomatik foreign key tespiti
      if (
        columnName.endsWith("_id") &&
        columnName !== "id" &&
        !columnInfo.foreignKey
      ) {
        const potentialTable = columnName.replace("_id", "s");
        if (allTables.includes(potentialTable)) {
          relations.push({
            type: "INFERRED_FOREIGN_KEY",
            from: `${tableName}.${columnName}`,
            to: `${potentialTable}.id`,
            relationshipType: "MANY_TO_ONE",
            description: `${tableName} tablosundaki ${columnName} muhtemelen ${potentialTable} tablosuna referans verir`,
          });
        }
      }

      // Primary key
      if (columnInfo.primaryKey) {
        relations.push({
          type: "PRIMARY_KEY",
          column: `${tableName}.${columnName}`,
          relationshipType: "UNIQUE",
          description: `${tableName} tablosunun birincil anahtarı`,
        });
      }

      // Unique constraints
      if (columnInfo.unique) {
        relations.push({
          type: "UNIQUE_CONSTRAINT",
          column: `${tableName}.${columnName}`,
          relationshipType: "UNIQUE",
          description: `${tableName} tablosundaki ${columnName} sütunu benzersiz değerler içerir`,
        });
      }
    });

    return relations;
  }

  // Tüm tabloların ilişkilerini al
  getAllRelations() {
    const allRelations = {};
    this.getTables().forEach((tableName) => {
      allRelations[tableName] = this.getTableRelations(tableName);
    });
    return allRelations;
  }

  // Veri türü analizi
  analyzeDataTypes(tableName) {
    const data = this.getTableData(tableName);
    const schema = this.getTableSchema(tableName);

    if (!data || data.length === 0) return {};

    const analysis = {};
    const sample = data[0];

    Object.keys(sample).forEach((columnName) => {
      const schemaInfo = schema[columnName];
      const values = data
        .map((row) => row[columnName])
        .filter((v) => v !== null);

      analysis[columnName] = {
        schemaType: schemaInfo?.type || "UNKNOWN",
        actualType: this.detectActualType(values),
        nullCount: data.filter((row) => row[columnName] === null).length,
        uniqueCount: new Set(values).size,
        sampleValues: values.slice(0, 3),
        constraints: {
          primaryKey: schemaInfo?.primaryKey || false,
          unique: schemaInfo?.unique || false,
          nullable: schemaInfo?.nullable !== false,
          foreignKey: schemaInfo?.foreignKey || null,
        },
      };
    });

    return analysis;
  }

  detectActualType(values) {
    if (values.length === 0) return "NULL";

    const sample = values[0];
    if (typeof sample === "number") {
      return Number.isInteger(sample) ? "INTEGER" : "DECIMAL";
    }
    if (typeof sample === "boolean") return "BOOLEAN";
    if (typeof sample === "string") {
      if (sample.includes("@")) return "EMAIL";
      if (sample.length > 100) return "TEXT";
      if (/^\d{4}-\d{2}-\d{2}/.test(sample)) return "DATE";
      return "VARCHAR";
    }
    return "UNKNOWN";
  }

  executeQuery(query) {
    try {
      // Simple query parser for demonstration
      const trimmedQuery = query.trim().toLowerCase();

      if (trimmedQuery.startsWith("select")) {
        return this.executeSelect(query);
      } else if (trimmedQuery.startsWith("insert")) {
        return this.executeInsert(query);
      } else if (trimmedQuery.startsWith("update")) {
        return this.executeUpdate(query);
      } else if (trimmedQuery.startsWith("delete")) {
        return this.executeDelete(query);
      } else if (trimmedQuery.startsWith("create table")) {
        return this.executeCreateTable(query);
      } else if (trimmedQuery.startsWith("drop table")) {
        return this.executeDropTable(query);
      } else {
        return {
          success: false,
          error: "Desteklenmeyen SQL komutu",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  executeSelect(query) {
    // Simple SELECT implementation
    const fromMatch = query.match(/from\s+(\w+)/i);
    if (!fromMatch) {
      throw new Error("FROM clause bulunamadı");
    }

    const tableName = fromMatch[1];
    const data = this.getTableData(tableName);

    if (!data) {
      throw new Error(`Tablo bulunamadı: ${tableName}`);
    }

    // Simple WHERE clause support
    const whereMatch = query.match(
      /where\s+(.+?)(?:\s+order\s+by|\s+limit|\s+group\s+by|$)/i
    );
    let filteredData = data;

    if (whereMatch) {
      const whereClause = whereMatch[1].trim();
      filteredData = data.filter((row) => {
        // Very simple WHERE evaluation (for demo)
        return this.evaluateWhereClause(row, whereClause);
      });
    }

    return {
      success: true,
      data: filteredData,
      rowCount: filteredData.length,
    };
  }

  executeInsert(query) {
    // Simple INSERT implementation
    const match = query.match(
      /insert\s+into\s+(\w+)\s*\(([^)]+)\)\s*values\s*\(([^)]+)\)/i
    );
    if (!match) {
      throw new Error("INSERT syntax hatası");
    }

    const tableName = match[1];
    const columns = match[2].split(",").map((col) => col.trim());
    const values = match[3]
      .split(",")
      .map((val) => val.trim().replace(/['"]/g, ""));

    const row = {};
    columns.forEach((col, index) => {
      row[col] = isNaN(values[index]) ? values[index] : Number(values[index]);
    });

    this.insertData(tableName, row);

    return {
      success: true,
      message: "1 satır eklendi",
      rowCount: 1,
    };
  }

  executeUpdate(query) {
    // Simple UPDATE implementation
    return {
      success: true,
      message: "UPDATE komutu simüle edildi",
      rowCount: 1,
    };
  }

  executeDelete(query) {
    // Simple DELETE implementation
    return {
      success: true,
      message: "DELETE komutu simüle edildi",
      rowCount: 1,
    };
  }

  executeCreateTable(query) {
    // Simple CREATE TABLE implementation
    const match = query.match(/create\s+table\s+(\w+)\s*\(([^)]+)\)/i);
    if (!match) {
      throw new Error("CREATE TABLE syntax hatası");
    }

    const tableName = match[1];
    const columnsStr = match[2];

    // Simple column parsing
    const schema = {};
    const columns = columnsStr.split(",");

    columns.forEach((col) => {
      const parts = col.trim().split(/\s+/);
      const columnName = parts[0];
      const columnType = parts[1] || "TEXT";
      schema[columnName] = { type: columnType };
    });

    this.createTable(tableName, schema);

    return {
      success: true,
      message: `Tablo '${tableName}' oluşturuldu`,
      rowCount: 0,
    };
  }

  executeDropTable(query) {
    const match = query.match(/drop\s+table\s+(\w+)/i);
    if (!match) {
      throw new Error("DROP TABLE syntax hatası");
    }

    const tableName = match[1];
    this.dropTable(tableName);

    return {
      success: true,
      message: `Tablo '${tableName}' silindi`,
      rowCount: 0,
    };
  }

  evaluateWhereClause(row, whereClause) {
    // Very simple WHERE clause evaluation for demo
    // This is a simplified implementation
    try {
      // Handle simple equality checks
      const eqMatch = whereClause.match(/(\w+)\s*=\s*['"]*([^'"]+)['"]*$/);
      if (eqMatch) {
        const column = eqMatch[1];
        const value = eqMatch[2];
        return String(row[column]) === String(value);
      }

      // Handle simple greater than
      const gtMatch = whereClause.match(/(\w+)\s*>\s*([0-9]+)$/);
      if (gtMatch) {
        const column = gtMatch[1];
        const value = Number(gtMatch[2]);
        return Number(row[column]) > value;
      }

      // Handle simple less than
      const ltMatch = whereClause.match(/(\w+)\s*<\s*([0-9]+)$/);
      if (ltMatch) {
        const column = ltMatch[1];
        const value = Number(ltMatch[2]);
        return Number(row[column]) < value;
      }

      return true; // Default to true for unsupported WHERE clauses
    } catch (error) {
      return true;
    }
  }
}

// Global database instance
let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = new DatabaseManager();
  }
  return dbInstance;
}
