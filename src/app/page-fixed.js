"use client";

import { useState, useEffect, useCallback } from "react";
import SqlEditor from "@/components/SqlEditor";
import TableManager from "@/components/TableManager";
import QueryResults from "@/components/QueryResults";
import {
  Database,
  Table,
  Play,
  Plus,
  Eye,
  EyeOff,
  GitBranch,
  ArrowLeftRight,
  Sparkles,
  Star,
} from "lucide-react";

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState("SELECT * FROM users;");
  const [queryResult, setQueryResult] = useState(null);
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("query");
  const [showSchemas, setShowSchemas] = useState(false);
  const [showRelations, setShowRelations] = useState(false);

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch("/api/tables");
      const data = await response.json();
      setTables(data.tables || []);
    } catch (error) {
      console.error("Tablolar yüklenirken hata:", error);
    }
  }, []);

  const executeQuery = useCallback(async () => {
    if (!currentQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: currentQuery }),
      });

      const result = await response.json();
      setQueryResult(result);

      // Refresh tables if the query might have changed the schema
      if (
        currentQuery.toLowerCase().includes("create table") ||
        currentQuery.toLowerCase().includes("drop table")
      ) {
        await fetchTables();
      }
    } catch (error) {
      setQueryResult({
        success: false,
        error: "Sorgu çalıştırılırken hata oluştu: " + error.message,
      });
    }
    setIsLoading(false);
  }, [currentQuery, fetchTables]);

  useEffect(() => {
    fetchTables();

    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        executeQuery();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [executeQuery, fetchTables]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-600/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="relative bg-gray-800/90 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 p-3 rounded-xl">
                  <Database className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  PostgreSQL Playground
                </h1>
                <p className="text-sm text-gray-300 font-medium">
                  Professional SQL Development Environment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-full border border-emerald-700/50">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-300">
                  Live Database
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gray-800/70 backdrop-blur-lg border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("query")}
              className={`relative py-4 px-6 font-semibold text-sm transition-all duration-300 rounded-t-lg ${
                activeTab === "query"
                  ? "text-blue-400 bg-gradient-to-b from-blue-900/30 to-transparent border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
              }`}
            >
              <Play className="inline h-4 w-4 mr-2" />
              SQL Query Studio
              {activeTab === "query" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("tables")}
              className={`relative py-4 px-6 font-semibold text-sm transition-all duration-300 rounded-t-lg ${
                activeTab === "tables"
                  ? "text-blue-400 bg-gradient-to-b from-blue-900/30 to-transparent border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/30"
              }`}
            >
              <Table className="inline h-4 w-4 mr-2" />
              Schema Manager
              {activeTab === "tables" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>
              )}
            </button>
          </nav>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === "query" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* SQL Editor */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden relative backdrop-blur-xl">
                <div className="px-8 py-6 bg-gray-700/50 border-b border-gray-600/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <h2 className="text-xl font-bold text-white ml-4">
                        SQL Editor Pro
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowSchemas(!showSchemas)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          showSchemas
                            ? "bg-blue-500/30 text-blue-200 border border-blue-400/30"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30"
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
                        onClick={() => setShowRelations(!showRelations)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          showRelations
                            ? "bg-cyan-500/30 text-cyan-200 border border-cyan-400/30"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/30"
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

                      <button
                        onClick={executeQuery}
                        disabled={isLoading}
                        className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        {isLoading ? "Executing..." : "Run Query"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <SqlEditor value={currentQuery} onChange={setCurrentQuery} />
                </div>
              </div>

              {/* Query Results */}
              {queryResult && (
                <div className="mt-8">
                  <QueryResults
                    result={queryResult}
                    showSchemas={showSchemas}
                    showRelations={showRelations}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Tables List */}
              <div className="bg-gray-800/90 rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden relative backdrop-blur-lg">
                <div className="px-8 py-6 bg-gray-700/50 border-b border-gray-600/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur-sm opacity-50"></div>
                      <div className="relative p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg">
                        <Table className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Database Tables
                    </h3>
                  </div>
                </div>
                <div className="p-8">
                  {tables.length > 0 ? (
                    <div className="space-y-4">
                      {tables.map((table, index) => (
                        <div
                          key={table}
                          className="group relative bg-gray-700/50 rounded-2xl border border-gray-600/50 overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10"
                        >
                          {/* Table header */}
                          <div className="px-6 py-4 border-b border-gray-600/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-600/20 rounded-lg group-hover:bg-blue-500/30 transition-all duration-300">
                                  <Table className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-white text-lg">
                                    {table}
                                  </h4>
                                  <p className="text-xs text-gray-400">
                                    Database Table #{index + 1}
                                  </p>
                                </div>
                              </div>
                              <div className="px-3 py-1 bg-blue-600/20 rounded-full border border-blue-500/30">
                                <span className="text-xs font-medium text-blue-300">
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Table actions */}
                          <div className="px-6 py-4">
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() =>
                                  setCurrentQuery(`SELECT * FROM ${table};`)
                                }
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/50 hover:bg-blue-500 text-blue-100 hover:text-white rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300"
                              >
                                <Play className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  SELECT
                                </span>
                              </button>

                              <button
                                onClick={() =>
                                  setCurrentQuery(`DESCRIBE ${table};`)
                                }
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600/50 hover:bg-gray-500 text-gray-300 hover:text-white rounded-xl border border-gray-500/30 hover:border-gray-400/50 transition-all duration-300"
                              >
                                <Eye className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  DESCRIBE
                                </span>
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    setCurrentQuery(
                                      `SELECT COUNT(*) FROM ${table};`
                                    )
                                  }
                                  className="px-2 py-1 text-xs bg-emerald-600/20 text-emerald-300 hover:bg-emerald-500/30 rounded-lg border border-emerald-500/30 transition-all duration-300"
                                >
                                  COUNT
                                </button>
                                <button
                                  onClick={() =>
                                    setCurrentQuery(
                                      `SELECT * FROM ${table} LIMIT 10;`
                                    )
                                  }
                                  className="px-2 py-1 text-xs bg-orange-600/20 text-orange-300 hover:bg-orange-500/30 rounded-lg border border-orange-500/30 transition-all duration-300"
                                >
                                  LIMIT 10
                                </button>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>•</span>
                                <span>Table {index + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center border border-gray-600/50">
                          <Table className="h-10 w-10 text-gray-400" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-gray-300 mb-2">
                        No Tables Found
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Your database is empty. Create your first table to get
                        started.
                      </p>
                      <button
                        onClick={() => setActiveTab("tables")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-medium rounded-xl shadow-lg transition-all duration-300"
                      >
                        <Plus className="h-4 w-4" />
                        Create Table
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Queries */}
              <div className="bg-gray-800/90 rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden relative backdrop-blur-lg">
                <div className="px-8 py-6 bg-gray-700/50 border-b border-gray-600/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur-sm opacity-50"></div>
                      <div className="relative p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      Query Templates
                    </h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-3">
                    {[
                      {
                        query: "SELECT * FROM users;",
                        type: "Basic Select",
                        color: "emerald",
                      },
                      {
                        query: "SELECT name, email FROM users WHERE age > 25;",
                        type: "Filtered",
                        color: "blue",
                      },
                      {
                        query:
                          "SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id;",
                        type: "Join",
                        color: "purple",
                      },
                      {
                        query:
                          "CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100), price DECIMAL);",
                        type: "DDL",
                        color: "orange",
                      },
                      {
                        query:
                          "INSERT INTO users (name, email, age) VALUES ('New User', 'new@example.com', 22);",
                        type: "Insert",
                        color: "teal",
                      },
                    ].map(({ query, type, color }, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuery(query)}
                        className="w-full text-left p-4 rounded-xl bg-gray-700/30 hover:bg-gray-600/50 transition-all duration-300 border border-gray-600/30 hover:border-gray-500/50"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-1 w-2 h-2 bg-${color}-400 rounded-full flex-shrink-0`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-xs font-semibold text-${color}-400 uppercase tracking-wide`}
                              >
                                {type}
                              </span>
                            </div>
                            <code className="text-xs text-gray-300 font-mono break-words leading-relaxed">
                              {query}
                            </code>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TableManager tables={tables} onTablesChange={fetchTables} />
        )}
      </main>
    </div>
  );
}
