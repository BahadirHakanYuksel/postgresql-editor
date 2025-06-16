"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Info,
  Clock,
  Database,
  Table,
  Key,
  Link,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeftRight,
  Users,
  FileText,
  GitBranch,
  Zap,
} from "lucide-react";

// Tablo şemalarını ve ilişkileri alacak fonksiyon
const fetchTableSchemas = async () => {
  try {
    const response = await fetch("/api/schemas");
    if (response.ok) {
      const data = await response.json();
      return data.success ? data.schemas : null;
    }
  } catch (error) {
    console.error("Şema bilgileri alınamadı:", error);
  }
  return null;
};

// Tablolar arası global ilişkileri analiz et
const analyzeGlobalRelations = (schemas) => {
  if (!schemas) return [];

  const allRelations = [];

  Object.entries(schemas).forEach(([tableName, tableInfo]) => {
    if (tableInfo.relations) {
      tableInfo.relations.forEach((relation) => {
        if (
          relation.type === "FOREIGN_KEY" ||
          relation.type === "INFERRED_FOREIGN_KEY"
        ) {
          allRelations.push({
            ...relation,
            sourceTable: tableName,
            targetTable: relation.to.split(".")[0],
          });
        }
      });
    }
  });

  return allRelations;
};

const QueryResults = ({ result }) => {
  const [showSchema, setShowSchema] = useState(false);
  const [showRelations, setShowRelations] = useState(false);
  const [showGlobalView, setShowGlobalView] = useState(false);
  const [schemas, setSchemas] = useState(null);

  useEffect(() => {
    fetchTableSchemas().then(setSchemas);
  }, [result]);

  if (!result) return null;

  // Tablodaki sütunlardan veri tiplerini analiz et
  const analyzeDataTypes = (data) => {
    if (!data || data.length === 0) return {};

    const sample = data[0];
    const types = {};

    Object.entries(sample).forEach(([key, value]) => {
      if (value === null) types[key] = "NULL";
      else if (typeof value === "number") {
        types[key] = Number.isInteger(value) ? "INTEGER" : "DECIMAL";
      } else if (typeof value === "boolean") types[key] = "BOOLEAN";
      else if (typeof value === "string") {
        if (value.includes("@")) types[key] = "EMAIL";
        else if (value.length > 50) types[key] = "TEXT";
        else types[key] = "VARCHAR";
      } else types[key] = "UNKNOWN";
    });

    return types;
  };

  // Foreign key ilişkilerini tespit et
  const detectRelations = (data) => {
    if (!data || data.length === 0) return [];

    const relations = [];
    const columns = Object.keys(data[0]);

    columns.forEach((column) => {
      if (column.endsWith("_id") && column !== "id") {
        const relatedTable = column.replace("_id", "s");
        relations.push({
          from: column,
          to: `${relatedTable}.id`,
          type: "FOREIGN KEY",
          description: `${column} → ${relatedTable}.id ilişkisi`,
        });
      }
    });

    return relations;
  };

  const dataTypes = result.data ? analyzeDataTypes(result.data) : {};
  const relations = result.data ? detectRelations(result.data) : [];
  const globalRelations = schemas ? analyzeGlobalRelations(schemas) : [];

  return (
    <div className="space-y-6">
      {/* Global Veritabanı Görünümü */}
      {showGlobalView && schemas && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow border border-emerald-200">
          <div className="px-6 py-4 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-900">
                Veritabanı Şeması
              </h3>
              <span className="text-sm text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                {Object.keys(schemas).length} tablo
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(schemas).map(([tableName, tableInfo]) => (
                <div
                  key={tableName}
                  className="bg-white rounded-lg border border-emerald-200 p-4 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Table className="h-5 w-5 text-emerald-600" />
                      <h4 className="font-semibold text-emerald-900">
                        {tableName}
                      </h4>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        {tableInfo.rowCount} satır
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {tableInfo.columns?.length || 0} sütun
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {tableInfo.columns?.slice(0, 4).map((column) => (
                      <div
                        key={column}
                        className="flex items-center gap-2 text-sm"
                      >
                        {column === "id" || column.endsWith("_id") ? (
                          <Key className="h-3 w-3 text-amber-500" />
                        ) : (
                          <FileText className="h-3 w-3 text-gray-400" />
                        )}
                        <span className="text-gray-700">{column}</span>
                        {column === "id" && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-1 rounded">
                            PK
                          </span>
                        )}
                        {column.endsWith("_id") && column !== "id" && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-1 rounded">
                            FK
                          </span>
                        )}
                      </div>
                    ))}
                    {tableInfo.columns?.length > 4 && (
                      <div className="text-xs text-gray-500">
                        +{tableInfo.columns.length - 4} sütun daha...
                      </div>
                    )}
                  </div>

                  {tableInfo.relations?.filter(
                    (r) =>
                      r.type === "FOREIGN_KEY" ||
                      r.type === "INFERRED_FOREIGN_KEY"
                  ).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-emerald-100">
                      <div className="text-xs text-emerald-600 font-medium mb-2">
                        İlişkiler:
                      </div>
                      {tableInfo.relations
                        .filter(
                          (r) =>
                            r.type === "FOREIGN_KEY" ||
                            r.type === "INFERRED_FOREIGN_KEY"
                        )
                        .slice(0, 2)
                        .map((relation, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-gray-600"
                          >
                            <ArrowRight className="h-3 w-3" />
                            <span>
                              {relation.from} → {relation.to}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Global İlişkiler Haritası */}
            {globalRelations.length > 0 && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-emerald-200">
                <h4 className="font-medium text-emerald-900 mb-3 flex items-center gap-2">
                  <ArrowLeftRight className="h-4 w-4" />
                  Tablolar Arası İlişkiler ({globalRelations.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {globalRelations.map((relation, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 px-2 py-1 bg-emerald-100 rounded text-xs font-medium text-emerald-800">
                        {relation.sourceTable}
                      </div>
                      <ArrowRight className="h-4 w-4 text-emerald-600" />
                      <div className="flex items-center gap-2 px-2 py-1 bg-blue-100 rounded text-xs font-medium text-blue-800">
                        {relation.targetTable}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Şema Görüntüleme */}
      {showSchema &&
        result.success &&
        result.data &&
        result.data.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow border border-blue-200">
            <div className="px-6 py-4 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">
                  Tablo Şeması
                </h3>
                <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {Object.keys(dataTypes).length} sütun
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(dataTypes).map(([column, type]) => (
                  <div
                    key={column}
                    className="bg-white rounded-lg border border-blue-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 flex items-center gap-2">
                        {column === "id" || column.endsWith("_id") ? (
                          <Key className="h-4 w-4 text-amber-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-gray-500" />
                        )}
                        {column}
                      </span>
                      {column === "id" && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          PRIMARY
                        </span>
                      )}
                      {column.endsWith("_id") && column !== "id" && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          FOREIGN
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span
                        className={`px-2 py-1 rounded text-xs font-mono ${
                          type === "INTEGER"
                            ? "bg-green-100 text-green-800"
                            : type === "VARCHAR" || type === "TEXT"
                            ? "bg-blue-100 text-blue-800"
                            : type === "EMAIL"
                            ? "bg-purple-100 text-purple-800"
                            : type === "BOOLEAN"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {/* İlişkiler Görüntüleme */}
      {showRelations &&
        result.success &&
        result.data &&
        result.data.length > 0 && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow border border-purple-200">
            <div className="px-6 py-4 border-b border-purple-200">
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">
                  Tablo İlişkileri
                </h3>
                <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                  {relations.length} ilişki
                </span>
              </div>
            </div>
            <div className="p-6">
              {relations.length > 0 ? (
                <div className="space-y-4">
                  {relations.map((relation, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border border-purple-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 px-3 py-2 bg-purple-100 rounded-lg">
                            <Table className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-purple-900">
                              {relation.from}
                            </span>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                          <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 rounded-lg">
                            <Database className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-900">
                              {relation.to}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-mono">
                          {relation.type}
                        </span>
                      </div>
                      {relation.description && (
                        <div className="mt-2 text-sm text-gray-600">
                          {relation.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-purple-600">
                  <Link className="h-8 w-8 mx-auto mb-2" />
                  <p>Bu tabloda foreign key ilişkisi bulunamadı.</p>{" "}
                  <p className="text-sm text-purple-500 mt-1">
                    &quot;_id&quot; ile biten sütunlar otomatik olarak ilişki
                    olarak algılanır.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

      {/* Ana Sorgu Sonucu */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                Sorgu Sonucu
              </h3>
              {result.success && result.rowCount !== undefined && (
                <span className="text-sm text-gray-500">
                  ({result.rowCount} satır)
                </span>
              )}
            </div>

            {/* Görüntüleme Seçenekleri */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGlobalView(!showGlobalView)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  showGlobalView
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <GitBranch className="h-4 w-4" />
                DB Şeması
                {showGlobalView ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </button>

              {result.success && result.data && result.data.length > 0 && (
                <>
                  <button
                    onClick={() => setShowSchema(!showSchema)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      showSchema
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <Database className="h-4 w-4" />
                    Şema
                    {showSchema ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </button>
                  <button
                    onClick={() => setShowRelations(!showRelations)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      showRelations
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                    İlişkiler
                    {showRelations ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {result.success ? (
            <>
              {result.message && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-green-800 text-sm">
                      {result.message}
                    </span>
                  </div>
                </div>
              )}

              {result.data && result.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(result.data[0]).map((column) => (
                          <th
                            key={column}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider relative"
                          >
                            <div className="flex items-center gap-2">
                              {column === "id" || column.endsWith("_id") ? (
                                <Key className="h-3 w-3 text-amber-500" />
                              ) : (
                                <FileText className="h-3 w-3 text-gray-400" />
                              )}
                              {column}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.data.map((row, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-blue-50 transition-colors`}
                        >
                          {Object.values(row).map((value, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {value === null ? (
                                <span className="text-gray-400 italic">
                                  NULL
                                </span>
                              ) : typeof value === "boolean" ? (
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    value
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {value.toString()}
                                </span>
                              ) : typeof value === "number" ? (
                                <span className="font-mono text-blue-600">
                                  {value}
                                </span>
                              ) : typeof value === "string" &&
                                value.includes("@") ? (
                                <span className="text-purple-600">{value}</span>
                              ) : (
                                value?.toString() || "-"
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : result.data && result.data.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Info className="h-8 w-8 mx-auto mb-2" />
                  <p>Sorgu başarıyla çalıştırıldı, ancak sonuç bulunamadı.</p>
                </div>
              ) : null}

              {result.executionTime && (
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  Çalışma süresi: {result.executionTime}ms
                  <Zap className="h-3 w-3 ml-2 text-yellow-500" />
                </div>
              )}
            </>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium mb-1">Hata</h4>
                  <p className="text-red-700 text-sm">{result.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryResults;
