import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPenTool,
  FiImage,
  FiFileText,
  FiCode,
  FiVideo,
  FiPlus,
  FiZap,
  FiLayout,
} from "react-icons/fi";

import Creation from "./Creation";
import AISuggestTemp from "./AISuggestTemp";
import Recents from "./Recents";
import BrandKitModal from "../BrandKitModal";

const BUTTONS = [
  { key: "design", label: "Design for me", icon: FiPenTool, tag: "Popular" },
  { key: "create-image", label: "Create image", icon: FiImage, tag: "New" },
  { key: "draft-document", label: "Draft document", icon: FiFileText },
  { key: "generate-code", label: "Generate code", icon: FiCode },
  { key: "create-video", label: "Create video", icon: FiVideo, tag: "Pro" },
  { key: "create-presentation", label: "Presentation", icon: FiLayout, tag: "New" },
];

const TABS = [
  { key: "your-designs", label: "Your designs" },
  { key: "templates", label: "Templates" },
  { key: "athena-ai", label: "Athena AI" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("your-designs");
  const [selectedButton, setSelectedButton] = useState(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [brandKitOpen, setBrandKitOpen] = useState(false);

  const isCodeMode = selectedButton === "generate-code";

  return (
    <div className="min-h-screen w-full bg-[linear-gradient(135deg,#f7f7fb_0%,#f3f4f8_40%,#eef2ff_100%)] px-3 sm:px-4 py-8 sm:py-10">

      {/* ===== Header ===== */}
      <div className="max-w-4xl pt-4 mx-auto text-center px-2">
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
          Create your{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
            next big idea
          </span>
        </h1>
        <p className="mt-3 text-slate-600 text-sm sm:text-lg">
          Design, write, code, and create - powered by Athena AI
        </p>
      </div>

      {/* ===== Tabs ===== */}
      {!isCodeMode && (
        <div className="mt-6 flex justify-center gap-2 sm:gap-3 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition
                ${activeTab === tab.key
                  ? "bg-slate-900 text-white shadow"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ===== Main Card ===== */}
      <div
        className={`
          mt-8 mx-auto bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-sm
          p-4 sm:p-6 transition-all
          w-full
          ${isCodeMode ? "max-w-4xl min-h-[70vh]" : "max-w-3xl"}
        `}
      >
        {/* ===== Prompt Row (Responsive) ===== */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-6">
          <div className="flex gap-4 w-full">

            <button
              className="w-10 h-10 self-start sm:self-auto rounded-xl border border-dashed flex items-center justify-center text-slate-500 hover:bg-slate-50"
              onClick={() => setSelectedButton(null)}
            >
              <FiPlus />
            </button>

            <input
              type="text"
              placeholder="Describe your idea…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-200 text-sm sm:text-base"
            />
          </div>

          <button
            disabled={!selectedButton || loading}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition
              ${selectedButton
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            <FiZap />
            Create
          </button>
        </div>

        {/* ===== Action Buttons ===== */}
        {!isCodeMode && (
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {BUTTONS.map((btn) => {
              const Icon = btn.icon;
              const active = selectedButton === btn.key;

              return (
                <button
                  key={btn.key}
                  onClick={() => {
                    if (btn.key === "create-presentation") {
                      navigate("/presentation");
                      return;
                    }

                    // toggle select / unselect
                    setSelectedButton((prev) =>
                      prev === btn.key ? null : btn.key
                    );
                  }}
                  className={`
            cursor-pointer
            flex items-center gap-2 sm:gap-3
            px-2 sm:px-2 py-2
            rounded-xl font-semibold
            transition-all duration-150
            w-[45%]

            text-[10px] sm:text-xs md:text-sm lg:text-base

            ${active
                      ? "bg-slate-900 text-white shadow"
                      : "bg-white border border-slate-200 text-slate-700 hover:shadow"
                    }
          `}
                >
                  {/* Icon */}
                  <Icon className="text-[12px] sm:text-sm md:text-base lg:text-lg shrink-0" />

                  {/* Label */}
                  <span className="truncate">
                    {btn.label}
                  </span>

                  {/* Tag */}
                  {btn.tag && (
                    <span
                      className="
                ml-1 sm:ml-2
                px-1 py-[1px]
                rounded-full
                bg-indigo-100 text-indigo-600
                text-[9px] sm:text-[4px] md:text-[11px]
                font-semibold
                whitespace-nowrap
              "
                    >
                      {btn.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}




      </div>

      {/* ===== Your Designs ===== */}
      {!isCodeMode && activeTab === "your-designs" && (
        <div className="max-w-6xl mx-auto mt-10 space-y-8 px-1 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={() => setBrandKitOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
            >
              Brand Kit
            </button>
            <button
              onClick={() => navigate("/image-editor")}
              className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700"
            >
              Smart Edit
            </button>
          </div>

          <AISuggestTemp />
          <Recents />
        </div>
      )}

      {/* ===== Templates ===== */}
      {!isCodeMode && activeTab === "templates" && (
        <div className="max-w-6xl mx-auto mt-10">
          <Creation />
        </div>
      )}

      {/* ===== Footer ===== */}
      <p className="mt-10 text-center text-xs sm:text-sm text-slate-400 px-4">
        Athena AI may generate inaccurate results. Please verify important information.
      </p>

      <BrandKitModal isOpen={brandKitOpen} onClose={() => setBrandKitOpen(false)} />
    </div>
  );
};

export default Dashboard;
