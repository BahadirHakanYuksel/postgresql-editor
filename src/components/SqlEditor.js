"use client";

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { githubLight } from "@uiw/codemirror-theme-github";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";
import { Moon, Sun, Palette, Code2, Database } from "lucide-react";

// PostgreSQL anahtar kelimeleri ve fonksiyonları
const postgresKeywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "OUTER",
  "ON",
  "GROUP",
  "BY",
  "HAVING",
  "ORDER",
  "ASC",
  "DESC",
  "LIMIT",
  "OFFSET",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
  "ALTER",
  "DROP",
  "INDEX",
  "VIEW",
  "TRIGGER",
  "FUNCTION",
  "PROCEDURE",
  "PRIMARY",
  "KEY",
  "FOREIGN",
  "REFERENCES",
  "UNIQUE",
  "NOT",
  "NULL",
  "DEFAULT",
  "CHECK",
  "CONSTRAINT",
  "SERIAL",
  "INTEGER",
  "VARCHAR",
  "TEXT",
  "DATE",
  "TIMESTAMP",
  "BOOLEAN",
  "DECIMAL",
  "REAL",
  "JSON",
  "JSONB",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "DISTINCT",
  "AS",
  "LIKE",
  "ILIKE",
  "IN",
  "EXISTS",
  "BETWEEN",
  "IS",
  "AND",
  "OR",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
  "WITH",
  "RECURSIVE",
  "UNION",
  "INTERSECT",
  "EXCEPT",
  "WINDOW",
  "OVER",
  "PARTITION",
  "ROW_NUMBER",
  "RANK",
  "DENSE_RANK",
  "LEAD",
  "LAG",
  "FIRST_VALUE",
  "LAST_VALUE",
  "NTILE",
];

// Özel PostgreSQL teması
const postgreSQLTheme = createTheme({
  theme: "light",
  settings: {
    background: "#fafbfc",
    foreground: "#24292f",
    caret: "#044289",
    selection: "#0969da22",
    selectionMatch: "#0969da44",
    lineHighlight: "#f6f8fa",
    gutterBackground: "#f6f8fa",
    gutterForeground: "#656d76",
    gutterBorder: "#d1d9e0",
  },
  styles: [
    { tag: t.keyword, color: "#cf222e", fontWeight: "bold" },
    { tag: t.string, color: "#0a3069" },
    { tag: t.number, color: "#0550ae" },
    { tag: t.operator, color: "#cf222e" },
    { tag: t.function(t.variableName), color: "#8250df" },
    { tag: t.typeName, color: "#0550ae", fontWeight: "bold" },
    { tag: t.comment, color: "#6e7781", fontStyle: "italic" },
    { tag: t.variableName, color: "#24292f" },
    { tag: t.bracket, color: "#24292f" },
    { tag: t.punctuation, color: "#24292f" },
  ],
});

// Özel Dark PostgreSQL teması
const postgreSQLDarkTheme = createTheme({
  theme: "dark",
  settings: {
    background: "#0d1117",
    foreground: "#f0f6fc",
    caret: "#79c0ff",
    selection: "#388bfd33",
    selectionMatch: "#388bfd66",
    lineHighlight: "#21262d",
    gutterBackground: "#161b22",
    gutterForeground: "#7d8590",
    gutterBorder: "#30363d",
  },
  styles: [
    { tag: t.keyword, color: "#ff7b72", fontWeight: "bold" },
    { tag: t.string, color: "#a5d6ff" },
    { tag: t.number, color: "#79c0ff" },
    { tag: t.operator, color: "#ff7b72" },
    { tag: t.function(t.variableName), color: "#d2a8ff" },
    { tag: t.typeName, color: "#79c0ff", fontWeight: "bold" },
    { tag: t.comment, color: "#8b949e", fontStyle: "italic" },
    { tag: t.variableName, color: "#f0f6fc" },
    { tag: t.bracket, color: "#f0f6fc" },
    { tag: t.punctuation, color: "#f0f6fc" },
  ],
});

const SqlEditor = ({ value, onChange, tables = [] }) => {
  const [isDark, setIsDark] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("postgresql");

  // Dinamik otomatik tamamlama oluştur
  const createAutocompletion = () => {
    const tableNames = tables.map((table) => ({
      label: table,
      type: "table",
      info: `Tablo: ${table}`,
    }));

    const columnSuggestions = tables.flatMap((table) => [
      {
        label: `${table}.id`,
        type: "column",
        info: `${table} tablosunun ID kolonu`,
      },
      {
        label: `${table}.*`,
        type: "column",
        info: `${table} tablosunun tüm kolonları`,
      },
    ]);

    const keywords = postgresKeywords.map((keyword) => ({
      label: keyword,
      type: "keyword",
      info: `PostgreSQL anahtar kelimesi`,
    }));

    const commonQueries = [
      {
        label: "SELECT * FROM ",
        type: "snippet",
        info: "Temel SELECT sorgusu",
      },
      {
        label: "SELECT COUNT(*) FROM ",
        type: "snippet",
        info: "Kayıt sayısını getir",
      },
      {
        label: "INSERT INTO ${table} (${columns}) VALUES (${values})",
        type: "snippet",
        info: "Yeni kayıt ekle",
      },
      {
        label: "UPDATE ${table} SET ${column} = ${value} WHERE ${condition}",
        type: "snippet",
        info: "Kayıt güncelle",
      },
      {
        label: "DELETE FROM ${table} WHERE ${condition}",
        type: "snippet",
        info: "Kayıt sil",
      },
    ];

    return autocompletion({
      override: [
        (context) => {
          const word = context.matchBefore(/\w*/);
          if (!word) return null;

          const options = [
            ...keywords,
            ...tableNames,
            ...columnSuggestions,
            ...commonQueries,
          ];

          return {
            from: word.from,
            options: options.filter((option) =>
              option.label.toLowerCase().includes(word.text.toLowerCase())
            ),
          };
        },
      ],
    });
  };

  const extensions = [
    sql(),
    createAutocompletion(),
    keymap.of([
      ...completionKeymap,
      {
        key: "Ctrl-Space",
        run: (view) => {
          view.dispatch({
            effects: [autocompletion().activate],
          });
          return true;
        },
      },
    ]),
  ];

  const themes = {
    postgresql: postgreSQLTheme,
    postgresqlDark: postgreSQLDarkTheme,
    github: githubLight,
    vscode: vscodeDark,
    oneDark: oneDark,
  };

  const getTheme = () => {
    if (currentTheme === "postgresql") {
      return isDark ? postgreSQLDarkTheme : postgreSQLTheme;
    }
    return themes[currentTheme] || postgreSQLTheme;
  };

  const themeOptions = [
    { key: "postgresql", name: "PostgreSQL", icon: "🐘" },
    { key: "github", name: "GitHub", icon: "🐱" },
    { key: "vscode", name: "VS Code", icon: "💙" },
    { key: "oneDark", name: "One Dark", icon: "🌙" },
  ];

  return (
    <div className="relative">
      {/* Tema Kontrol Paneli */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm p-1">
          <select
            value={currentTheme}
            onChange={(e) => setCurrentTheme(e.target.value)}
            className="text-xs bg-transparent border-none outline-none pr-2 text-gray-700"
          >
            {themeOptions.map((theme) => (
              <option key={theme.key} value={theme.key}>
                {theme.icon} {theme.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={isDark ? "Açık tema" : "Koyu tema"}
          >
            {isDark ? (
              <Sun className="h-3 w-3" />
            ) : (
              <Moon className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>

      {/* SQL Editör Başlığı */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <Code2 className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            SQL Query Editor
          </span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Editör Konteyneri */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-xl blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        <div className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {" "}
          <CodeMirror
            value={value}
            height="300px"
            extensions={extensions}
            onChange={(val) => onChange(val)}
            theme={getTheme()}
            basicSetup={{
              lineNumbers: true,
              highlightActiveLine: true,
              highlightSelectionMatches: true,
              searchKeymap: true,
              foldGutter: true,
              dropCursor: true,
              allowMultipleSelections: true,
              indentOnInput: true,
              bracketMatching: true,
              closeBrackets: true,
              autocompletion: true,
              rectangularSelection: true,
              crosshairCursor: true,
            }}
            style={{
              fontSize: "16px",
              fontFamily:
                '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              fontWeight: "500",
            }}
          />
        </div>
      </div>

      {/* SQL İpuçları */}
      <div className="mt-3 flex flex-wrap gap-2">
        <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
          💡 Ctrl+Space: Auto-complete
        </div>
        <div className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
          ⚡ Ctrl+Enter: Hızlı çalıştır
        </div>
        <div className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full border border-purple-200">
          🎨 Tema değiştir
        </div>
      </div>
    </div>
  );
};

export default SqlEditor;
