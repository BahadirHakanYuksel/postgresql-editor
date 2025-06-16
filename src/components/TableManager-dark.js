"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Table,
  Database,
  Key,
  FileText,
  Eye,
  Settings,
  Zap,
} from "lucide-react";

const TableManager = ({ tables, onTablesChange }) => {
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [newTableColumns, setNewTableColumns] = useState([
    { name: "id", type: "SERIAL", primaryKey: true, nullable: false },
  ]);
  const [selectedTable, setSelectedTable] = useState("");
  const [tableData, setTableData] = useState([]);

  const columnTypes = [
    "SERIAL",
    "INTEGER",
    "BIGINT",
    "VARCHAR(100)",
    "VARCHAR(255)",
    "TEXT",
    "BOOLEAN",
    "DATE",
    "TIMESTAMP",
    "DECIMAL",
    "REAL",
    "JSON",
  ];

  const addColumn = () => {
    setNewTableColumns([
      ...newTableColumns,
      { name: "", type: "VARCHAR(100)", primaryKey: false, nullable: true },
    ]);
  };

  const removeColumn = (index) => {
    if (newTableColumns.length > 1) {
      setNewTableColumns(newTableColumns.filter((_, i) => i !== index));
    }
  };

  const updateColumn = (index, field, value) => {
    const updatedColumns = [...newTableColumns];
    updatedColumns[index][field] = value;
    setNewTableColumns(updatedColumns);
  };

  const createTable = async () => {
    if (!newTableName.trim()) return;

    const columnDefinitions = newTableColumns
      .map((col) => {
        const constraints = [];
        if (col.primaryKey) constraints.push("PRIMARY KEY");
        if (!col.nullable) constraints.push("NOT NULL");
        return `${col.name} ${col.type} ${constraints.join(" ")}`;
      })
      .join(", ");

    const query = `CREATE TABLE ${newTableName} (${columnDefinitions});`;

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      if (result.success) {
        setShowCreateTable(false);
        setNewTableName("");
        setNewTableColumns([
          { name: "id", type: "SERIAL", primaryKey: true, nullable: false },
        ]);
        onTablesChange();
      }
    } catch (error) {
      console.error("Tablo oluşturulamadı:", error);
    }
  };

  const loadTableData = async (tableName) => {
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `SELECT * FROM ${tableName} LIMIT 100;`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setTableData(result.data || []);
        setSelectedTable(tableName);
      }
    } catch (error) {
      console.error("Tablo verileri yüklenemedi:", error);
    }
  };

  const dropTable = async (tableName) => {
    if (
      !confirm(`"${tableName}" tablosunu silmek istediğinizden emin misiniz?`)
    )
      return;

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `DROP TABLE ${tableName};` }),
      });

      const result = await response.json();
      if (result.success) {
        onTablesChange();
        if (selectedTable === tableName) {
          setSelectedTable("");
          setTableData([]);
        }
      }
    } catch (error) {
      console.error("Tablo silinemedi:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent"></div>

      {/* Subtle animated elements */}
      <div className="absolute top-20 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 -right-4 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>

      <div className="relative space-y-8 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            Schema Manager
          </h1>
          <p className="text-slate-400 text-lg">
            Create and manage your database structure
          </p>
        </div>

        {/* Create Table Section */}
        <div className="bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/20 rounded-xl border border-blue-500/30">
                  <Database className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    Create New Table
                  </h2>
                  <p className="text-slate-400">
                    Design your database structure
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateTable(!showCreateTable)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  showCreateTable
                    ? "bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30"
                    : "bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {showCreateTable ? "Cancel" : "New Table"}
                </div>
              </button>
            </div>
          </div>

          {showCreateTable && (
            <div className="p-8">
              <div className="space-y-6">
                {/* Table Name Input */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-slate-100">
                    Table Name
                  </label>
                  <input
                    type="text"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-slate-100 placeholder-slate-400"
                    placeholder="Enter table name..."
                  />
                </div>

                {/* Columns Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-lg font-semibold text-slate-100">
                      Table Columns
                    </label>
                    <button
                      onClick={addColumn}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600/30 transition-all duration-300 border border-blue-500/30"
                    >
                      <Plus className="h-4 w-4" />
                      Add Column
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {newTableColumns.map((column, index) => (
                      <div
                        key={index}
                        className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          {/* Column Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                              Column Name
                            </label>
                            <input
                              type="text"
                              value={column.name}
                              onChange={(e) =>
                                updateColumn(index, "name", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100 placeholder-slate-500"
                              placeholder="column_name"
                              disabled={index === 0}
                            />
                          </div>

                          {/* Data Type */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                              Data Type
                            </label>
                            <select
                              value={column.type}
                              onChange={(e) =>
                                updateColumn(index, "type", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-100"
                              disabled={index === 0}
                            >
                              {columnTypes.map((type) => (
                                <option
                                  key={type}
                                  value={type}
                                  className="bg-slate-800"
                                >
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Primary Key */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                              Primary Key
                            </label>
                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="checkbox"
                                checked={column.primaryKey}
                                onChange={(e) =>
                                  updateColumn(
                                    index,
                                    "primaryKey",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                                disabled={index === 0}
                              />
                              <span className="text-slate-400 text-sm">
                                {column.primaryKey ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>

                          {/* Nullable */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                              Nullable
                            </label>
                            <div className="flex items-center gap-2 pt-2">
                              <input
                                type="checkbox"
                                checked={column.nullable}
                                onChange={(e) =>
                                  updateColumn(
                                    index,
                                    "nullable",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                                disabled={index === 0}
                              />
                              <span className="text-slate-400 text-sm">
                                {column.nullable ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">
                              Actions
                            </label>
                            <div className="pt-2">
                              {index > 0 && (
                                <button
                                  onClick={() => removeColumn(index)}
                                  className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/30"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Button */}
                <div className="flex justify-end">
                  <button
                    onClick={createTable}
                    disabled={!newTableName.trim()}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
                  >
                    Create Table
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Existing Tables */}
        <div className="bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600/20 rounded-xl border border-emerald-500/30">
                <Table className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  Existing Tables
                </h2>
                <p className="text-slate-400">
                  {tables.length} table{tables.length !== 1 ? "s" : ""} in your
                  database
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {tables.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table, index) => (
                  <div
                    key={table}
                    className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-500/30">
                          <Table className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-100">{table}</h3>
                          <p className="text-sm text-slate-400">
                            Table #{index + 1}
                          </p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => dropTable(table)}
                          className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => loadTableData(table)}
                        className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 border border-blue-500/30 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Data
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => console.log(`DESCRIBE ${table}`)}
                          className="px-3 py-2 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-all duration-300 border border-emerald-500/30 text-sm flex items-center gap-1"
                        >
                          <Settings className="h-3 w-3" />
                          Schema
                        </button>
                        <button
                          onClick={() =>
                            console.log(`SELECT COUNT(*) FROM ${table}`)
                          }
                          className="px-3 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-all duration-300 border border-yellow-500/30 text-sm flex items-center gap-1"
                        >
                          <Zap className="h-3 w-3" />
                          Count
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Table className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-2">
                  No Tables Found
                </h3>
                <p className="text-slate-400 mb-6">
                  Create your first table to get started with your database.
                </p>
                <button
                  onClick={() => setShowCreateTable(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium"
                >
                  Create Your First Table
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Table Data Display */}
        {selectedTable && tableData.length > 0 && (
          <div className="bg-slate-900/50 backdrop-blur-lg rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-500/30">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">
                    {selectedTable} Data
                  </h2>
                  <p className="text-slate-400">
                    {tableData.length} row{tableData.length !== 1 ? "s" : ""}{" "}
                    displayed
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      {Object.keys(tableData[0] || {}).map((column) => (
                        <th
                          key={column}
                          className="px-6 py-3 text-left text-sm font-semibold text-slate-200 uppercase tracking-wider"
                        >
                          <div className="flex items-center gap-2">
                            {column === "id" || column.endsWith("_id") ? (
                              <Key className="h-4 w-4 text-yellow-400" />
                            ) : (
                              <FileText className="h-4 w-4 text-slate-400" />
                            )}
                            {column}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {tableData.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-6 py-4 whitespace-nowrap text-sm text-slate-300"
                          >
                            {value === null ? (
                              <span className="text-slate-500 italic">
                                NULL
                              </span>
                            ) : typeof value === "boolean" ? (
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  value
                                    ? "bg-emerald-600/20 text-emerald-400"
                                    : "bg-red-600/20 text-red-400"
                                }`}
                              >
                                {value.toString()}
                              </span>
                            ) : typeof value === "number" ? (
                              <span className="font-mono text-blue-400">
                                {value}
                              </span>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableManager;
