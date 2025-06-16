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
    // Load initial tables
    fetchTables();

    // Keyboard shortcut for executing query (Ctrl+Enter)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      {/* Premium Background Effects - Blue Theme */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-slate-900/90 via-blue-900/90 to-slate-900/90 backdrop-blur-2xl border-b border-blue-500/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur-sm opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-cyan-400 p-2 rounded-xl">
                  <Database className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  PostgreSQL Playground
                </h1>
                <p className="text-sm text-blue-200 font-medium">
                  Professional SQL Development Environment
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-100">
                  Live Database
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-gradient-to-r from-slate-800/80 via-blue-800/80 to-slate-800/80 backdrop-blur-lg border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("query")}
              className={`relative py-4 px-6 font-semibold text-sm transition-all duration-300 rounded-t-lg ${
                activeTab === "query"
                  ? "text-white bg-gradient-to-b from-blue-600/30 to-transparent border-b-2 border-blue-400 shadow-sm"
                  : "text-blue-200 hover:text-white hover:bg-blue-500/10"
              }`}
            >
              <Play className="inline h-4 w-4 mr-2" />
              SQL Query Studio
              {activeTab === "query" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("tables")}
              className={`relative py-4 px-6 font-semibold text-sm transition-all duration-300 rounded-t-lg ${
                activeTab === "tables"
                  ? "text-white bg-gradient-to-b from-blue-600/30 to-transparent border-b-2 border-blue-400 shadow-sm"
                  : "text-blue-200 hover:text-white hover:bg-blue-500/10"
              }`}
            >
              <Table className="inline h-4 w-4 mr-2" />
              Schema Manager
              {activeTab === "tables" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
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
              <div className="glass-dark rounded-3xl shadow-2xl border border-blue-500/20 overflow-hidden relative">
                {/* Premium header with glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
                <div className="relative px-8 py-6 bg-gradient-to-r from-slate-800/90 via-blue-800/90 to-slate-800/90 border-b border-blue-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse animation-delay-2000"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse animation-delay-4000"></div>
                      </div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent ml-4">
                        SQL Editor Pro
                      </h2>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Schema Toggle */}
                      <button
                        onClick={() => setShowSchemas(!showSchemas)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          showSchemas
                            ? "bg-blue-500/30 text-blue-100 border border-blue-400/30"
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

                      {/* Relations Toggle */}
                      <button
                        onClick={() => setShowRelations(!showRelations)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          showRelations
                            ? "bg-cyan-500/30 text-cyan-100 border border-cyan-400/30"
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

                      {/* Execute Button */}
                      <button
                        onClick={executeQuery}
                        disabled={isLoading}
                        className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-75"></div>
                        <div className="relative flex items-center">
                          <Play className="h-5 w-5 mr-2" />
                          {isLoading ? "Executing..." : "Run Query"}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="relative p-8">
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
              <div className="glass-dark rounded-3xl shadow-xl border border-blue-500/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
                <div className="relative px-8 py-6 bg-gradient-to-r from-blue-800/90 to-cyan-800/90 border-b border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur-sm opacity-50"></div>
                      <div className="relative p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg">
                        <Table className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                      Database Tables
                    </h3>
                  </div>
                </div>
                <div className="relative p-8">
                  {tables.length > 0 ? (
                    <div className="space-y-3">
                      {tables.map((table) => (
                        <button
                          key={table}
                          onClick={() =>
                            setCurrentQuery(`SELECT * FROM ${table};`)
                          }
                          className="w-full group text-left px-5 py-4 text-sm rounded-xl hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 text-blue-100 hover:text-white transition-all duration-300 border border-blue-500/20 hover:border-blue-400/50 hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Table className="h-4 w-4 text-blue-400 group-hover:text-white transition-colors duration-300" />
                              <span className="font-medium">{table}</span>
                            </div>
                            <div className="text-xs text-blue-400 group-hover:text-white transition-colors duration-300">
                              SELECT
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Table className="h-8 w-8 text-blue-400" />
                      </div>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        No tables found.
                        <br />
                        Create tables using the Schema Manager tab.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sample Queries */}
              <div className="glass-dark rounded-3xl shadow-xl border border-blue-500/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl"></div>
                <div className="relative px-8 py-6 bg-gradient-to-r from-purple-800/90 to-pink-800/90 border-b border-purple-500/30">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg blur-sm opacity-50"></div>
                      <div className="relative p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                        <Play className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
                      Query Templates
                    </h3>
                  </div>
                </div>
                <div className="relative p-8">
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
                        className="w-full group text-left p-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-blue-700/50 transition-all duration-300 border border-slate-600/30 hover:border-blue-500/50 hover:shadow-lg"
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
                            <code className="text-xs text-blue-200 group-hover:text-white font-mono break-words leading-relaxed">
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
          <div className="glass-dark rounded-3xl shadow-2xl border border-blue-500/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl"></div>
            <div className="relative">
              <TableManager tables={tables} onTablesChange={fetchTables} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
