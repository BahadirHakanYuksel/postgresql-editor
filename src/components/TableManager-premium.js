"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Table,
  Link,
  Eye,
  Database,
  Key,
  FileText,
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
        let definition = `${col.name} ${col.type}`;
        if (col.primaryKey) definition += " PRIMARY KEY";
        if (!col.nullable) definition += " NOT NULL";
        return definition;
      })
      .join(", ");

    const sql = `CREATE TABLE ${newTableName} (${columnDefinitions});`;

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: sql }),
      });

      const result = await response.json();
      if (result.success) {
        setNewTableName("");
        setNewTableColumns([
          { name: "id", type: "SERIAL", primaryKey: true, nullable: false },
        ]);
        setShowCreateTable(false);
        onTablesChange();
      }
    } catch (error) {
      console.error("Tablo oluşturulamadı:", error);
    }
  };

  const loadTableData = async (tableName) => {
    try {
      const response = await fetch(`/api/tables/${tableName}`);
      const data = await response.json();
      if (data.success) {
        setTableData(data.data);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative space-y-8 p-8">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent mb-4">
            Schema Manager Pro
          </h1>
          <p className="text-blue-200 text-lg">
            Create and manage your database tables with advanced tools
          </p>
        </div>

        {/* Create Table Section */}
        <div className="glass-dark rounded-3xl shadow-2xl border border-blue-500/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
          <div className="relative px-8 py-6 bg-gradient-to-r from-blue-800/90 to-cyan-800/90 border-b border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur-sm opacity-50"></div>
                  <div className="relative p-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Table Creation Studio
                  </h2>
                  <p className="text-blue-200">
                    Design your database structure
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateTable(!showCreateTable)}
                className={`relative inline-flex items-center px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                  showCreateTable
                    ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-red-500/25"
                    : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-blue-500/25"
                } transform hover:scale-105`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-50"></div>
                <div className="relative flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {showCreateTable ? "Cancel" : "New Table"}
                </div>
              </button>
            </div>
          </div>

          {showCreateTable && (
            <div className="relative p-8 bg-gradient-to-br from-slate-800/50 to-blue-800/50 backdrop-blur-lg">
              <div className="space-y-6">
                {/* Table Name Input */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-blue-100">
                    🏷️ Table Name
                  </label>
                  <input
                    type="text"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-blue-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-white placeholder-blue-300/60 backdrop-blur-sm"
                    placeholder="e.g. products, users, orders"
                  />
                </div>

                {/* Columns Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-lg font-semibold text-blue-100">
                      📊 Table Columns
                    </label>
                    <button
                      onClick={addColumn}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 shadow-lg hover:shadow-emerald-500/25"
                    >
                      <Plus className="h-4 w-4" />
                      Add Column
                    </button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {newTableColumns.map((column, index) => (
                      <div
                        key={index}
                        className="glass-dark rounded-2xl border border-blue-500/30 p-6 hover:border-cyan-400/50 transition-all duration-300"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Column Name */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-200">
                              Column Name
                            </label>
                            <input
                              type="text"
                              value={column.name}
                              onChange={(e) =>
                                updateColumn(index, "name", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-blue-300/60"
                              placeholder="column_name"
                              disabled={index === 0}
                            />
                          </div>

                          {/* Data Type */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-blue-200">
                              Data Type
                            </label>
                            <select
                              value={column.type}
                              onChange={(e) =>
                                updateColumn(index, "type", e.target.value)
                              }
                              className="w-full px-3 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white"
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

                          {/* Constraints */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-blue-200">
                              Constraints
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm text-blue-100">
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
                                  disabled={index === 0}
                                  className="rounded bg-slate-700 border-blue-500/30 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-800"
                                />
                                Primary Key
                              </label>
                              <label className="flex items-center gap-2 text-sm text-blue-100">
                                <input
                                  type="checkbox"
                                  checked={!column.nullable}
                                  onChange={(e) =>
                                    updateColumn(
                                      index,
                                      "nullable",
                                      !e.target.checked
                                    )
                                  }
                                  className="rounded bg-slate-700 border-blue-500/30 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-800"
                                />
                                Not Null
                              </label>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-end">
                            {newTableColumns.length > 1 && (
                              <button
                                onClick={() => removeColumn(index)}
                                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create Button */}
                <div className="flex justify-end pt-6 border-t border-blue-500/30">
                  <button
                    onClick={createTable}
                    className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-50"></div>
                    <div className="relative flex items-center gap-3">
                      <Table className="h-5 w-5" />
                      Create Table
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Existing Tables Section */}
        <div className="glass-dark rounded-3xl shadow-2xl border border-blue-500/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl"></div>
          <div className="relative px-8 py-6 bg-gradient-to-r from-purple-800/90 to-pink-800/90 border-b border-purple-500/30">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur-sm opacity-50"></div>
                <div className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                  Existing Tables
                </h2>
                <p className="text-purple-200">Manage your database tables</p>
              </div>
            </div>
          </div>

          <div className="relative p-8">
            {tables.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table, index) => (
                  <div
                    key={table}
                    className="group glass-dark rounded-2xl border border-purple-500/30 overflow-hidden hover:border-pink-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
                  >
                    {/* Table Card Header */}
                    <div className="px-6 py-4 bg-gradient-to-r from-purple-800/50 to-pink-800/50 border-b border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-400 rounded-lg blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative p-2 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-lg group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
                              <Table className="h-4 w-4 text-purple-200 group-hover:text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-bold text-purple-100 group-hover:text-white text-lg">
                              {table}
                            </h3>
                            <p className="text-xs text-purple-300/70">
                              Table #{index + 1}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table Actions */}
                    <div className="p-6 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => loadTableData(table)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600/50 to-cyan-600/50 hover:from-blue-500 hover:to-cyan-500 text-blue-100 hover:text-white rounded-lg transition-all duration-300 text-sm"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button
                          onClick={() => dropTable(table)}
                          className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-red-600/50 to-pink-600/50 hover:from-red-500 hover:to-pink-500 text-red-100 hover:text-white rounded-lg transition-all duration-300 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Drop
                        </button>
                      </div>

                      {selectedTable === table && (
                        <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-blue-500/20">
                          <div className="text-sm text-blue-200 mb-2">
                            📊 Table Data ({tableData.length} rows)
                          </div>
                          {tableData.length > 0 && (
                            <div className="max-h-32 overflow-y-auto">
                              <div className="text-xs text-blue-300/70 space-y-1">
                                {Object.keys(tableData[0]).map((column) => (
                                  <div
                                    key={column}
                                    className="flex items-center gap-2"
                                  >
                                    {column === "id" ||
                                    column.endsWith("_id") ? (
                                      <Key className="h-3 w-3 text-yellow-400" />
                                    ) : (
                                      <FileText className="h-3 w-3 text-gray-400" />
                                    )}
                                    <span>{column}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30">
                    <Table className="h-10 w-10 text-purple-400" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-purple-200 mb-2">
                  No Tables Found
                </h4>
                <p className="text-purple-300/70 text-sm leading-relaxed">
                  Henüz tablo yok. Yukarıdaki &quot;Yeni Tablo&quot; butonuyla
                  tablo oluşturabilirsiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableManager;
