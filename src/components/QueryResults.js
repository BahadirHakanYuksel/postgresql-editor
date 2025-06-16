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
  Sparkles,
  Star,
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

const QueryResults = ({ 
  result, 
  showSchemas = false, 
  showRelations = false,
  onToggleSchemas,
  onToggleRelations 
}) => {
  const [schemas, setSchemas] = useState(null);
  const [localShowSchemas, setLocalShowSchemas] = useState(false);
  const [localShowRelations, setLocalShowRelations] = useState(false);

  useEffect(() => {
    const loadSchemas = async () => {
      const schemaData = await fetchTableSchemas();
      setSchemas(schemaData);
    };
    loadSchemas();
  }, []);

  // Props'tan gelen değerleri yerel state ile senkronize et
  useEffect(() => {
    setLocalShowSchemas(showSchemas);
  }, [showSchemas]);

  useEffect(() => {
    setLocalShowRelations(showRelations);
  }, [showRelations]);

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

  if (!result) {
    return (
      <div className="animate-slide-in glass-dark rounded-3xl p-8 border border-blue-500/30 shadow-2xl relative overflow-hidden">
        {/* Premium Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-cyan-400/10 to-blue-400/10 rounded-3xl"></div>
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full blur-2xl opacity-20"></div>
        
        <div className="relative flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <Database className="relative h-12 w-12 text-blue-400 animate-float" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                Ready to Execute
              </h3>
              <p className="text-blue-200 text-lg">Your powerful SQL query awaits...</p>
              <div className="flex items-center gap-2 text-sm text-blue-300">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Premium SQL Environment</span>
                <Star className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dataTypes = result.data ? analyzeDataTypes(result.data) : {};
  const relations = result.data ? detectRelations(result.data) : [];
  const globalRelations = schemas ? analyzeGlobalRelations(schemas) : [];

  return (
    <div className="space-y-6">
      {/* Schema View - Şemalar */}
      {localShowSchemas && schemas && (
        <div className="glass-dark rounded-3xl shadow-2xl border border-blue-500/30 overflow-hidden relative animate-slide-in">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-cyan-400/10 to-blue-400/10"></div>
          
          <div className="relative px-8 py-6 border-b border-blue-500/30 bg-gradient-to-r from-blue-800/50 to-cyan-800/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full blur-md opacity-50"></div>
                <GitBranch className="relative h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Database Schema
                </h3>
                <p className="text-blue-200 font-medium">
                  {Object.keys(schemas).length} tables discovered
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(schemas).map(([tableName, tableInfo]) => (
                <div
                  key={tableName}
                  className="card-premium glass-dark rounded-2xl border border-blue-500/20 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5"></div>
                  
                  <div className="relative flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-lg blur-sm opacity-50"></div>
                        <Table className="relative h-6 w-6 text-blue-400" />
                      </div>
                      <h4 className="text-xl font-bold text-white">{tableName}</h4>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-200 text-sm rounded-full font-medium border border-blue-500/30">
                        {tableInfo.rowCount} rows
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 text-cyan-200 text-sm rounded-full font-medium border border-cyan-500/30">
                        {tableInfo.columns?.length || 0} cols
                      </span>
                    </div>
                  </div>

                  <div className="relative space-y-3">
                    {tableInfo.columns?.slice(0, 6).map((column) => (
                      <div
                        key={column}
                        className="flex items-center justify-between p-3 glass-dark rounded-xl border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          {column === "id" || column.endsWith("_id") ? (
                            <Key className="h-4 w-4 text-yellow-400" />
                          ) : (
                            <FileText className="h-4 w-4 text-blue-300" />
                          )}
                          <span className="font-medium text-white">{column}</span>
                        </div>
                        <div className="flex gap-2">
                          {column === "id" && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full font-medium border border-yellow-500/30">
                              PRIMARY
                            </span>
                          )}
                          {column.endsWith("_id") && column !== "id" && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full font-medium border border-purple-500/30">
                              FOREIGN
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {tableInfo.columns?.length > 6 && (
                      <div className="text-center py-2">
                        <span className="text-sm text-blue-300 italic">
                          +{tableInfo.columns.length - 6} more columns...
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Relations View - İlişkiler */}
      {localShowRelations && globalRelations.length > 0 && (
        <div className="glass-dark rounded-3xl shadow-2xl border border-cyan-500/30 overflow-hidden relative animate-slide-in">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-cyan-400/10"></div>
          
          <div className="relative px-8 py-6 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-800/50 to-blue-800/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-md opacity-50"></div>
                <ArrowLeftRight className="relative h-8 w-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-blue-100 bg-clip-text text-transparent">
                  Database Relations
                </h3>
                <p className="text-cyan-200 font-medium">
                  {globalRelations.length} relationships found
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {globalRelations.map((relation, index) => (
                <div
                  key={index}
                  className="glass-dark rounded-2xl border border-cyan-500/20 p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                        <Table className="h-4 w-4 text-cyan-300" />
                        <span className="font-medium text-cyan-100">
                          {relation.sourceTable}
                        </span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-400" />
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <Database className="h-4 w-4 text-blue-300" />
                        <span className="font-medium text-blue-100">
                          {relation.targetTable}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-blue-200">
                    <span className="font-mono text-xs bg-slate-700/50 px-2 py-1 rounded">
                      {relation.from} → {relation.to}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Query Result */}
      <div className="glass-dark rounded-3xl shadow-2xl border border-blue-500/30 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-400/10"></div>
        
        <div className="relative px-8 py-6 border-b border-blue-500/30">          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {result.success ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-md opacity-50"></div>
                  <CheckCircle className="relative h-8 w-8 text-emerald-400 animate-pulse" />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-600 rounded-full blur-md opacity-50"></div>
                  <XCircle className="relative h-8 w-8 text-red-400" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  {result.success ? "Query Executed Successfully" : "Query Error"}
                </h3>
                {result.success && result.rowCount !== undefined && (
                  <p className="text-emerald-300 font-medium">
                    {result.rowCount} rows returned
                  </p>
                )}
              </div>
            </div>

            {/* Schema and Relations Toggle Buttons */}
            {result.success && onToggleSchemas && onToggleRelations && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleSchemas(!showSchemas)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    showSchemas
                      ? "bg-blue-500/30 text-blue-100 border border-blue-400/50"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/30"
                  }`}
                >
                  <GitBranch className="h-4 w-4" />
                  Schema
                  {showSchemas ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </button>

                <button
                  onClick={() => onToggleRelations(!showRelations)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    showRelations
                      ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400/50"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/30"
                  }`}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                  Relations
                  {showRelations ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="relative p-8">
          {result.success ? (
            <>
              {result.message && (
                <div className="mb-6 p-4 glass-dark rounded-2xl border border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <Info className="h-5 w-5 text-emerald-400" />
                    <span className="text-emerald-200 font-medium">{result.message}</span>
                  </div>
                </div>
              )}

              {result.data && result.data.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-blue-500/20 shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="table-premium w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-slate-800/90 to-blue-800/90">
                          {Object.keys(result.data[0]).map((column) => (
                            <th
                              key={column}
                              className="px-6 py-4 text-left text-sm font-bold text-blue-100 uppercase tracking-wider border-b border-blue-500/30"
                            >
                              <div className="flex items-center gap-2">
                                {column === "id" || column.endsWith("_id") ? (
                                  <Key className="h-4 w-4 text-yellow-400" />
                                ) : (
                                  <FileText className="h-4 w-4 text-blue-300" />
                                )}
                                {column}
                                {column === "id" && (
                                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded-full font-medium">
                                    PK
                                  </span>
                                )}
                                {column.endsWith("_id") && column !== "id" && (
                                  <span className="px-2 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full font-medium">
                                    FK
                                  </span>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-500/20">
                        {result.data.map((row, index) => (
                          <tr
                            key={index}
                            className="card-premium hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 transition-all duration-300"
                          >
                            {Object.entries(row).map(([column, value], cellIndex) => (
                              <td
                                key={cellIndex}
                                className="px-6 py-4 whitespace-nowrap text-sm"
                              >
                                {value === null ? (
                                  <span className="px-2 py-1 bg-slate-600/50 text-slate-300 rounded-lg text-xs italic">
                                    NULL
                                  </span>
                                ) : typeof value === "boolean" ? (
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                                      value
                                        ? "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-200 border border-emerald-500/30"
                                        : "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-200 border border-red-500/30"
                                    }`}
                                  >
                                    {value.toString()}
                                  </span>
                                ) : typeof value === "number" ? (
                                  <span className="font-mono text-blue-200 font-semibold bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">
                                    {value}
                                  </span>
                                ) : typeof value === "string" && value.includes("@") ? (
                                  <span className="text-purple-200 font-medium bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30">
                                    {value}
                                  </span>
                                ) : (
                                  <span className="text-white font-medium">
                                    {value?.toString() || "-"}
                                  </span>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-full blur-lg opacity-20"></div>
                    <Info className="relative h-16 w-16 mx-auto mb-4 text-blue-400" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">
                    Query Executed Successfully
                  </h4>
                  <p className="text-blue-200">No results found for this query.</p>
                </div>
              )}

              {/* Premium Execution Time */}
              {result.executionTime && (
                <div className="mt-6 flex items-center justify-center gap-4 p-4 glass-dark rounded-2xl border border-blue-500/20">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">Execution Time:</span>
                    <span className="font-mono font-bold">{result.executionTime}ms</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Zap className="h-5 w-5" />
                    <span className="font-medium">Lightning Fast</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-6 glass-dark rounded-2xl border border-red-500/30">
              <div className="flex items-start gap-4">
                <XCircle className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-red-300 font-bold mb-2 text-lg">Error Details</h4>
                  <p className="text-red-200 leading-relaxed">{result.error}</p>
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
