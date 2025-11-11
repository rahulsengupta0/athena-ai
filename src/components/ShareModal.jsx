import React from "react";
import { FiSearch, FiX, FiSave, FiUser } from "react-icons/fi";

const ShareModal = ({
  isOpen,
  onClose,
  title = "Share",
  members = [],
  selectedIds = [],
  setSelectedIds,
  onSave,
  saving = false,
}) => {
  if (!isOpen) return null;

  const toggle = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1400,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(95vw, 720px)",
          background: "#ffffff",
          borderRadius: 16,
          boxShadow: "0 30px 80px rgba(15,23,42,0.35)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a" }}>{title}</div>
            <div
              style={{
                color: "#64748b",
                fontSize: "0.85rem",
                fontWeight: 600,
                background: "#f1f5f9",
                padding: "4px 8px",
                borderRadius: 999,
              }}
            >
              {selectedIds.length} selected
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#64748b",
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
            aria-label="Close"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <FiX size={18} />
          </button>
        </div>
        <div
          style={{
            padding: 16,
            maxHeight: "65vh",
            overflowY: "auto",
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              marginBottom: 12,
              background: "#ffffff",
            }}
          >
            <FiSearch size={16} color="#64748b" />
            <input
              placeholder="Search members by name or email..."
              onChange={(e) => {
                const q = e.target.value.toLowerCase();
                // Simple in-place filter: we don't mutate 'members', we just hide via data-attr
                const container = e.currentTarget.closest('[data-share-list]');
                if (!container) return;
                Array.from(container.querySelectorAll('[data-member]')).forEach((el) => {
                  const text = (el.getAttribute('data-text') || '').toLowerCase();
                  el.style.display = text.includes(q) ? "" : "none";
                });
              }}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "0.95rem",
                color: "#0f172a",
                background: "transparent",
              }}
            />
          </div>
          {members.length === 0 ? (
            <div style={{ color: "#94a3b8", textAlign: "center", padding: 20 }}>
              No team members found.
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }} data-share-list>
              {(members || [])
                .filter((m) => {
                  const role = m.role || m.userId?.role || "";
                  const status = (m.status || m.userId?.status || "").toLowerCase();
                  const isAccepted = status === "active" || status === "accepted";
                  return role !== "owner" && isAccepted; // only admins/members with accepted/active status
                })
                .map((m) => {
                const id = m.userId?._id || m._id || m.userId; // support different shapes
                const name = [m.userId?.firstName || m.firstName, m.userId?.lastName || m.lastName]
                  .filter(Boolean)
                  .join(" ") || m.email || "Member";
                const email = m.userId?.email || m.email || "";
                const role = m.role || m.userId?.role || "";
                const isSelected = selectedIds.includes(String(id));
                return (
                  <li
                    key={String(id)}
                    onClick={() => toggle(String(id))}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      marginBottom: 10,
                      cursor: "pointer",
                      background: isSelected ? "#f4f3ff" : "#ffffff",
                    }}
                    data-member
                    data-text={`${name} ${email} ${role}`}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: isSelected ? "#ede9fe" : "#f1f5f9",
                        color: "#4c1d95",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        overflow: "hidden",
                      }}
                    >
                      {m.avatar && String(m.avatar).startsWith('http') ? (
                        <img src={m.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <FiUser size={18} />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{name}</div>
                        {role && (
                          <span
                            style={{
                              fontSize: "0.72rem",
                              background: "#eef2ff",
                              color: "#3730a3",
                              borderRadius: 999,
                              padding: "2px 8px",
                              fontWeight: 700,
                            }}
                          >
                            {role}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                        {email} {role ? `• ${role}` : ""}
                      </div>
                    </div>
                    <div
                      aria-hidden
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: isSelected ? "none" : "1px solid #e5e7eb",
                        background: isSelected ? "#8b5cf6" : "#ffffff",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      {isSelected ? "✓" : ""}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div
          style={{
            padding: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              border: "1px solid #e5e7eb",
              background: "#ffffff",
              color: "#111827",
              padding: "10px 16px",
              borderRadius: 10,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            style={{
              border: "none",
              background: saving ? "#cbd5e1" : "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)",
              color: "#ffffff",
              padding: "10px 16px",
              borderRadius: 10,
              cursor: saving ? "not-allowed" : "pointer",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {saving ? "Saving..." : (<><FiSave size={16} /> Save</>)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;


