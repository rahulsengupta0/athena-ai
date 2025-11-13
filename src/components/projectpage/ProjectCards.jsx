import React, { useState, useEffect } from "react";
import {
  FiMoreHorizontal,
  FiStar,
  FiEye,
  FiEdit2,
  FiDownload,
  FiShare2,
  FiTrash2,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";
import {
  FaPalette,
  FaCamera,
  FaGlobe,
  FaRegFileAlt,
  FaRegStar,
  FaThLarge,
} from "react-icons/fa";

import RecentProjectCard from "./RecentProjectCard";
import ClientProjectCard from "./ClientProjectCard";
import ArchiveProjectCard from "./ArchiveProjectCard";
import PersonalProjectCard from "./PersonalProjectCard";
import TemplateProjectCard from "./TemplateProjectCard";

const projects = [
  {
    icon: <FaPalette size={32} style={{ color: "#f79ebb" }} />,
    title: "Brand Identity - TechStart",
    desc: "Complete brand package including logo, colors, and guidelines",
    category: "Brand",
    status: "Completed",
    statusColor: "#6cc996",
    hashtags: ["#branding", "#logo", "#startup"],
    date: "2 days ago",
    size: "12.4 MB",
    favorite: true,
  },
  {
    icon: <FaThLarge size={32} style={{ color: "#fbba46" }} />,
    title: "Social Media Campaign",
    desc: "Instagram posts and stories for wellness brand",
    category: "Social Media",
    status: "In Progress",
    statusColor: "#6b91f6",
    hashtags: ["#social", "#wellness", "#instagram"],
    date: "1 hour ago",
    size: "8.7 MB",
    favorite: false,
  },
  {
    icon: <FaGlobe size={32} style={{ color: "#36c0ef" }} />,
    title: "Website Landing Page",
    desc: "Modern landing page design for SaaS",
    category: "Web Design",
    status: "Draft",
    statusColor: "#ffd452",
    hashtags: ["#web", "#saas", "#landing"],
    date: "3 days ago",
    size: "15.2 MB",
    favorite: true,
  },
  {
    icon: <FaCamera size={32} style={{ color: "#b6aeea" }} />,
    title: "Product Photography",
    desc: "AI-enhanced product photos for e-commerce",
    category: "Photography",
    status: "Completed",
    statusColor: "#6cc996",
    hashtags: ["#product", "#ecommerce", "#photo"],
    date: "1 week ago",
    size: "45.8 MB",
    favorite: false,
  },
  {
    icon: <FaThLarge size={32} style={{ color: "#fbba46" }} />,
    title: "Mobile App UI Kit",
    desc: "Comprehensive UI components for mobile app",
    category: "UI Design",
    status: "In Progress",
    statusColor: "#6b91f6",
    hashtags: ["#mobile", "#ui", "#components"],
    date: "5 hours ago",
    size: "28.3 MB",
    favorite: true,
  },
  {
    icon: <FaRegFileAlt size={32} style={{ color: "#d7c3ee" }} />,
    title: "Marketing Brochure",
    desc: "Print-ready brochure design for medical practice",
    category: "Print Design",
    status: "Review",
    statusColor: "#c98df7",
    hashtags: ["#print", "#medical", "#brochure"],
    date: "2 days ago",
    size: "6.1 MB",
    favorite: false,
  },
];

const folderMapping = {
  recent: [
    "Brand Identity - TechStart",
    "Social Media Campaign",
    "Website Landing Page",
  ],
  client: ["Brand Identity - TechStart", "Marketing Brochure"],
  personal: ["Product Photography"],
  templates: ["Website Landing Page", "Mobile App UI Kit"],
  archive: ["Marketing Brochure"],
};

const statusBg = {
  Completed: "#eafbf3",
  "In Progress": "#e7f0fd",
  Draft: "#fff9e7",
  Review: "#f7edfa",
};

const statusColor = {
  Completed: "#4db97f",
  "In Progress": "#387df6",
  Draft: "#b68d00",
  Review: "#ac50d9",
};

const projectFilters = [
  "All Projects",
  "Favorites",
  "Completed",
  "In Progress",
  "Draft",
  "Review",
];

export const ProjectCards = ({ folderType = "recent" }) => {
  const [dropdown, setDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(projectFilters[0]);
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandKits, setBrandKits] = useState([]);
  const [brandKitFolders, setBrandKitFolders] = useState([]);
  const [loadingBrandKitFolders, setLoadingBrandKitFolders] = useState(true);
  const [hoveredBrandKit, setHoveredBrandKit] = useState(null);
  const [deletingKit, setDeletingKit] = useState(null);

  // Helper function to extract brand name from kitFolder
  const extractBrandName = (kitFolder) => {
    // kitFolder format: "name-lowercase-timestamp"
    // Remove the last part (timestamp) and convert back to readable format
    const parts = kitFolder.split('-');
    // Find where the timestamp starts (last part that's all digits and long enough to be a timestamp)
    let nameParts = [];
    for (let i = 0; i < parts.length; i++) {
      // Check if this part is a timestamp (all digits and at least 10 digits long)
      if (/^\d+$/.test(parts[i]) && parts[i].length >= 10) {
        // This is the timestamp, stop here
        break;
      }
      nameParts.push(parts[i]);
    }
    // Join and capitalize first letter of each word
    return nameParts
      .join(' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Match brand kit folders with brand kits from database
  const getBrandKitInfo = (kitFolder) => {
    const extractedName = extractBrandName(kitFolder);
    // Try to find matching brand kit in database
    const matchedKit = brandKits.find(kit => 
      kit.name.toLowerCase().replace(/ /g, '-') === extractedName.toLowerCase().replace(/ /g, '-')
    );
    return matchedKit || { name: extractedName, isShared: false, sharedBy: null };
  };

  // Handle delete brand kit
  const handleDeleteBrandKit = async (e, kitFolder) => {
    e.stopPropagation(); // Prevent card click navigation
    
    const brandKitInfo = getBrandKitInfo(kitFolder);
    const confirmed = window.confirm(
      `Are you sure you want to delete "${brandKitInfo.name}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setDeletingKit(kitFolder);
    try {
      // Delete from S3 using kitFolder
      await api.deleteBrandKitFolder(kitFolder);
      
      // If there's a matching database record, delete it too
      if (brandKitInfo._id) {
        try {
          await api.deleteBrandKit(brandKitInfo._id);
        } catch (dbError) {
          console.error('Error deleting from database:', dbError);
          // Continue even if database deletion fails
        }
      }
      
      // Refresh the lists
      const folders = await api.getBrandKitFolders();
      setBrandKitFolders(folders || []);
      
      const kits = await api.getBrandKits();
      setBrandKits(kits || []);
    } catch (error) {
      console.error('Error deleting brand kit:', error);
      alert('Failed to delete brand kit: ' + (error.message || 'Unknown error'));
    } finally {
      setDeletingKit(null);
    }
  };

  // Fetch brand kits from backend
  useEffect(() => {
    const fetchBrandKits = async () => {
      try {
        const kits = await api.getBrandKits();
        setBrandKits(kits || []);
      } catch (error) {
        console.error('Error fetching brand kits:', error);
        setBrandKits([]);
      }
    };
    const fetchBrandKitFolders = async () => {
      try {
        setLoadingBrandKitFolders(true);
        const folders = await api.getBrandKitFolders();
        setBrandKitFolders(folders || []);
      } catch (error) {
        console.error('Error fetching brand kit folders:', error);
        setBrandKitFolders([]);
      } finally {
        setLoadingBrandKitFolders(false);
      }
    };
    fetchBrandKits();
    fetchBrandKitFolders();
  }, []);

  if (loading) {
    return (
      <div style={{
        width: "100%",
        maxWidth: 1320,
        margin: "0 auto", 
        padding: "28px 24px 20px 24px",
        textAlign: "center",
        fontSize: "1.2rem",
        color: "#888"
      }}>
        Loading projects...
      </div>
    );
  }

  // Filter projects based on folder mapping and selected filter
  let displayedProjects =
    folderType && folderMapping[folderType]
      ? projects.filter((card) => folderMapping[folderType].includes(card.title))
      : projects;

  if (selectedFilter !== "All Projects") {
    if (selectedFilter === "Favorites") {
      displayedProjects = displayedProjects.filter((card) => card.favorite);
    } else {
      displayedProjects = displayedProjects.filter(
        (card) => card.status === selectedFilter
      );
    }
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 1320,
        margin: "0 auto",
        padding: "28px 24px 20px 24px",
      }}
    >
      {/* Top bar with search and filter */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 340,
            maxWidth: "90%",
          }}
        >
          <FiSearch
            style={{ position: "absolute", top: 14, left: 18, color: "#b3b7cd", fontSize: 20 }}
          />
          <input
            type="text"
            placeholder="Search projects..."
            style={{
              width: "100%",
              borderRadius: "16px",
              background: "#fafbff",
              border: "1.5px solid #eeeff7",
              outline: "none",
              padding: "11px 16px 11px 44px",
              fontSize: "1.11rem",
              color: "#24243b",
              fontWeight: 500,
            }}
          />
        </div>

        {/* Filter dropdown */}
        <div style={{ position: "relative", minWidth: 175 }}>
          <button
            onClick={() => setDropdown((d) => !d)}
            style={{
              background: "#fff",
              border: "1.5px solid #eeeff7",
              color: "#6d6f80",
              padding: "8px 30px 8px 16px",
              borderRadius: "16px",
              fontSize: "1.07rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              minWidth: 148,
              boxShadow: dropdown ? "0 3px 28px #a889ff13" : "none",
            }}
          >
            {selectedFilter}
            <FiChevronDown
              style={{
                marginLeft: 12,
                fontSize: 20,
                transition: "all 0.18s",
                transform: dropdown ? "rotate(-180deg)" : "",
              }}
            />
          </button>
          {dropdown && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "102%",
                marginTop: 6,
                background: "#fff",
                borderRadius: 17,
                boxShadow: "0 6px 32px #aba7ed35",
                zIndex: 40,
                minWidth: 182,
                padding: "7px 0",
                border: "1.5px solid #edecfa",
              }}
            >
              {projectFilters.map((v) => (
                <div
                  key={v}
                  onClick={() => {
                    setSelectedFilter(v);
                    setDropdown(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 18px",
                    fontWeight: v === selectedFilter ? 700 : 500,
                    color: v === selectedFilter ? "#7049f7" : "#37344a",
                    background: v === selectedFilter ? "#ece7fc" : "none",
                    fontSize: "1.08rem",
                    cursor: "pointer",
                  }}
                >
                  {v === selectedFilter && (
                    <span
                      style={{
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 13,
                          height: 13,
                          borderRadius: "50%",
                          background: "#9267fa",
                          marginRight: 10,
                          verticalAlign: "middle",
                        }}
                      ></span>
                    </span>
                  )}
                  {v}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Card Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "28px",
        }}
      >
        {/* Conditional render project cards based on folder type */}
        {folderType === "recent" && (
          <RecentProjectCard
            projects={displayedProjects}
            hovered={hovered}
            setHovered={setHovered}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        )}

        {folderType === "client" && (
          <ClientProjectCard
            projects={displayedProjects}
            hovered={hovered}
            setHovered={setHovered}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        )}

        {folderType === "archive" && (
          <ArchiveProjectCard
            projects={displayedProjects}
            hovered={hovered}
            setHovered={setHovered}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        )}

        {folderType === "personal" && (
          <PersonalProjectCard
            projects={displayedProjects}
            hovered={hovered}
            setHovered={setHovered}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        )}

        {folderType === "templates" && (
          <TemplateProjectCard
            projects={displayedProjects}
            hovered={hovered}
            setHovered={setHovered}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        )}

        
      </div>
    </div>
  );
};

const MenuItem = ({ icon, text, danger }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "9px 20px",
      cursor: "pointer",
      color: danger ? "#ed5972" : "#35345e",
      fontWeight: 600,
      fontSize: "1.04rem",
      borderTop: "1px solid #f2f0ff",
      background: danger ? "#fff6f7" : "#fff",
      transition: "background 0.11s",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.background = danger ? "#ffe8ea" : "#f6f4fd")
    }
    onMouseLeave={(e) =>
      (e.currentTarget.style.background = danger ? "#fff6f7" : "#fff")
    }
  >
    {icon}
    {text}
  </div>
);
export default ProjectCards;
