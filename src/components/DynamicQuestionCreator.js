"use client";

import { useState } from "react";
import {
  Plus,
  Save,
  X,
  Lightbulb,
  Target,
  Zap,
  BookOpen,
  Code,
  Star,
} from "lucide-react";

const DynamicQuestionCreator = ({ onQuestionAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "easy",
    points: 10,
    hint: "",
    solution: "",
    explanation: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});

  const difficulties = [
    {
      value: "easy",
      label: "Kolay",
      color: "emerald",
      icon: BookOpen,
      basePoints: 10,
    },
    {
      value: "medium",
      label: "Orta",
      color: "blue",
      icon: Target,
      basePoints: 30,
    },
    { value: "hard", label: "Zor", color: "purple", icon: Zap, basePoints: 60 },
  ];

  const categories = [
    "Temel SELECT",
    "Filtreleme",
    "Sıralama",
    "JOIN İşlemleri",
    "Aggregate Fonksiyonlar",
    "Subqueries",
    "Window Functions",
    "Advanced Analytics",
    "Performance",
    "Özel Kategori",
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Soru başlığı gerekli";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Soru açıklaması gerekli";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Kategori seçimi gerekli";
    }

    if (!formData.solution.trim()) {
      newErrors.solution = "SQL çözümü gerekli";
    }

    if (formData.points < 5 || formData.points > 100) {
      newErrors.points = "Puan 5-100 arasında olmalı";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newQuestion = {
      id: Date.now(), // Basit ID generation
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
      isCustom: true,
    };

    onQuestionAdd(newQuestion);
    onClose();
  };

  const handleDifficultyChange = (difficulty) => {
    const selectedDiff = difficulties.find((d) => d.value === difficulty);
    setFormData((prev) => ({
      ...prev,
      difficulty,
      points: selectedDiff ? selectedDiff.basePoints : 10,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700/50 max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-gray-700/50 border-b border-gray-600/50 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Plus className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Yeni Soru Oluştur
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-600/50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Title */}
            <div className="lg:col-span-2">
              <label className="block text-white font-semibold mb-2">
                Soru Başlığı *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Örn: Müşteri Sipariş JOIN'i"
                className={`w-full bg-gray-900/50 border rounded-lg p-3 text-gray-200 focus:outline-none transition-colors ${
                  errors.title
                    ? "border-red-500/50"
                    : "border-gray-600/50 focus:border-blue-500/50"
                }`}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Kategori *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className={`w-full bg-gray-900/50 border rounded-lg p-3 text-gray-200 focus:outline-none transition-colors ${
                  errors.category
                    ? "border-red-500/50"
                    : "border-gray-600/50 focus:border-blue-500/50"
                }`}
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-400 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Zorluk Seviyesi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((diff) => {
                  const Icon = diff.icon;
                  const isSelected = formData.difficulty === diff.value;

                  return (
                    <button
                      key={diff.value}
                      type="button"
                      onClick={() => handleDifficultyChange(diff.value)}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        isSelected
                          ? `bg-${diff.color}-600/30 border-${diff.color}-500/50 text-${diff.color}-200`
                          : "bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mx-auto mb-1" />
                      <div className="text-sm font-medium">{diff.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Soru Açıklaması *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Bu soruda ne yapılması gerektiğini açıklayın..."
              rows={3}
              className={`w-full bg-gray-900/50 border rounded-lg p-3 text-gray-200 focus:outline-none transition-colors resize-none ${
                errors.description
                  ? "border-red-500/50"
                  : "border-gray-600/50 focus:border-blue-500/50"
              }`}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Points and Tags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Points */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Puan (5-100)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.points}
                  onChange={(e) =>
                    handleInputChange("points", parseInt(e.target.value) || 0)
                  }
                  className={`w-full bg-gray-900/50 border rounded-lg p-3 text-gray-200 focus:outline-none transition-colors ${
                    errors.points
                      ? "border-red-500/50"
                      : "border-gray-600/50 focus:border-blue-500/50"
                  }`}
                />
                <Star className="absolute right-3 top-3 h-5 w-5 text-yellow-400" />
              </div>
              {errors.points && (
                <p className="text-red-400 text-sm mt-1">{errors.points}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Etiketler (virgülle ayırın)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="JOIN, GROUP BY, Advanced"
                className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg p-3 text-gray-200 focus:border-blue-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Hint */}
          <div>
            {" "}
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              İpucu
            </label>
            <textarea
              value={formData.hint}
              onChange={(e) => handleInputChange("hint", e.target.value)}
              placeholder="Kullanıcılara yardımcı olacak bir ipucu yazın..."
              rows={2}
              className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg p-3 text-gray-200 focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Solution */}
          <div>
            {" "}
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              <Code className="h-4 w-4 text-green-400" />
              SQL Çözümü *
            </label>
            <textarea
              value={formData.solution}
              onChange={(e) => handleInputChange("solution", e.target.value)}
              placeholder="SELECT * FROM ..."
              rows={4}
              className={`w-full bg-gray-900/50 border rounded-lg p-3 text-gray-200 font-mono text-sm focus:outline-none transition-colors resize-none ${
                errors.solution
                  ? "border-red-500/50"
                  : "border-gray-600/50 focus:border-blue-500/50"
              }`}
            />
            {errors.solution && (
              <p className="text-red-400 text-sm mt-1">{errors.solution}</p>
            )}
          </div>

          {/* Explanation */}
          <div>
            {" "}
            <label className="flex items-center gap-2 text-white font-semibold mb-2">
              <BookOpen className="h-4 w-4 text-blue-400" />
              Açıklama
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => handleInputChange("explanation", e.target.value)}
              placeholder="Çözümün nasıl çalıştığını açıklayın..."
              rows={3}
              className="w-full bg-gray-900/50 border border-gray-600/50 rounded-lg p-3 text-gray-200 focus:border-blue-500/50 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-600/50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-300 hover:text-white transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="h-4 w-4" />
              Soruyu Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicQuestionCreator;
