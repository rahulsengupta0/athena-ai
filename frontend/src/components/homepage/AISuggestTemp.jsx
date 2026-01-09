import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiInstagram,
  FiVideo,
  FiBriefcase,
  FiImage,
  FiFileText,
  FiGlobe,
  FiMail,
  FiMaximize2,
} from "react-icons/fi";
import { FaFacebook, FaLinkedin, FaTwitter, FaPinterest } from "react-icons/fa";

import BussinessCard from "../../assets/bussiness.png";
import Facebook from "../../assets/facebook.png";
import Instagram from "../../assets/insta.png";
import Social from "../../assets/socialMedia.png";
import Poster from "../../assets/poster.png";
import Youtube from "../../assets/youtube.png";
import api from "../../services/api";

const TEMPLATES = [
  { id: 1, name: "Social Media Post", width: 1080, height: 1080, category: "Social", thumbnail: Social, description: "Perfect for engaging social content" },
  { id: 2, name: "Instagram Story", width: 1080, height: 1920, category: "Social", thumbnail: Instagram, description: "Full-screen stories that captivate" },
  { id: 3, name: "Facebook Cover", width: 1200, height: 630, category: "Social", thumbnail: Facebook, description: "Professional cover photos" },
  { id: 4, name: "YouTube Thumbnail", width: 1280, height: 720, category: "Video", thumbnail: Youtube, description: "Click-worthy video thumbnails" },
  { id: 5, name: "Business Card", width: 1050, height: 600, category: "Business", thumbnail: BussinessCard, description: "Professional networking cards" },
  { id: 6, name: "Poster", width: 1080, height: 1350, category: "Print", thumbnail: Poster, description: "Eye-catching promotional posters" },
];

const AISuggestTemp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [suggestedTemplates, setSuggestedTemplates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isPhone = window.innerWidth <= 768;
  const isSmallMobile = window.innerWidth <= 360;

  const cardsPerView = isSmallMobile ? 1 : isPhone ? 2 : 3;

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const projects = await api.getProjects();
        setSuggestedTemplates(TEMPLATES.slice(0, 6));
      } catch {
        setSuggestedTemplates(TEMPLATES.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const maxIndex = Math.max(0, suggestedTemplates.length - cardsPerView);

  const getIcon = (category, name) => {
    const cls = "text-indigo-500";
    if (category === "Social") {
      if (name.includes("Instagram")) return <FiInstagram className={cls} />;
      if (name.includes("Facebook")) return <FaFacebook className={cls} />;
      return <FiInstagram className={cls} />;
    }
    if (category === "Video") return <FiVideo className={cls} />;
    if (category === "Business") return <FiBriefcase className={cls} />;
    if (category === "Print") return <FiFileText className={cls} />;
    return <FiMaximize2 className={cls} />;
  };

  return (
    <section className="w-full py-6 sm:py-8 bg-gradient-to-br from-indigo-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Suggested For You
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Templates tailored to your activity
            </p>
          </div>

          <button
            onClick={() => navigate("/ai-suggest-templates")}
            className="flex items-center gap-1 text-indigo-600 text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition cursor-pointer"
          >
            View All <FiChevronRight />
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20 text-slate-500">
            Loading templates…
          </div>
        ) : (
          <div className="relative">

            {/* Left Arrow */}
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex((p) => Math.max(0, p - 1))}
                className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-10
                           w-10 h-10 rounded-full bg-white border
                           flex items-center justify-center shadow
                           hover:scale-110 transition cursor-pointer"
              >
                <FiChevronLeft className="text-indigo-600" />
              </button>
            )}

            {/* Carousel */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out gap-4"
                style={{
                  transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
                }}
              >
                {suggestedTemplates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => navigate("/canva-clone", { state: { selectedTemplate: t } })}
                    className="cursor-pointer bg-white rounded-2xl shadow
                               overflow-hidden group flex-shrink-0
                               w-full sm:w-[48%] lg:w-[32%]"
                  >
                    {/* Image */}
                    <div className="relative h-56 sm:h-64 overflow-hidden">
                      <img
                        src={t.thumbnail}
                        alt={t.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />

                      {/* Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        {getIcon(t.category, t.name)}
                        {t.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-slate-900 font-bold text-lg mb-1 drop-shadow">
                        {t.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-3">
                        {t.description}
                      </p>

                      <div className="flex justify-between items-center bg-indigo-50 rounded-xl px-3 py-2 text-sm font-semibold text-indigo-700">
                        <span>{t.width} × {t.height}</span>
                        <span className="flex items-center gap-1">
                          Use <FiChevronRight />
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            {currentIndex < maxIndex && (
              <button
                onClick={() => setCurrentIndex((p) => Math.min(maxIndex, p + 1))}
                className="absolute right-[-12px] top-1/2 -translate-y-1/2 z-10
                           w-10 h-10 rounded-full bg-white border
                           flex items-center justify-center shadow
                           hover:scale-110 transition cursor-pointer"
              >
                <FiChevronRight className="text-indigo-600" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AISuggestTemp;
