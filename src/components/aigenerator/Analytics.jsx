import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "./Styles";

const Analytics = () => {
  const analyticsData = [
    { label: "Total Creations", value: 128, color: "#6c5ce7" },
    { label: "Active Tools Used", value: 4, color: "#0984e3" },
    { label: "Avg. AI Confidence", value: "89%", color: "#00b894" },
    { label: "Saved Projects", value: 42, color: "#fd79a8" },
  ];

  const usageTrend = [
    { name: "Mon", creations: 20 },
    { name: "Tue", creations: 35 },
    { name: "Wed", creations: 25 },
    { name: "Thu", creations: 45 },
    { name: "Fri", creations: 40 },
    { name: "Sat", creations: 60 },
    { name: "Sun", creations: 55 },
  ];

  const topTools = [
    { name: "Design Generator", usage: "43%" },
    { name: "AI Writer", usage: "27%" },
    { name: "Dashboard Builder", usage: "18%" },
    { name: "Content Refiner", usage: "12%" },
  ];

  return (
    <motion.div
      style={styles.page}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* HEADER */}
      <motion.div
        style={styles.header}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 style={styles.mainTitle}>Analytics Overview</h2>
        <p style={styles.subtitle}>Your AI usage and performance insights</p>
      </motion.div>

      {/* ANALYTICS OVERVIEW CARDS */}
      <motion.div
        style={styles.analyticsOverviewGrid}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {analyticsData.map((item, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 24px rgba(151,96,255,0.12)",
            }}
            transition={{ type: "spring", stiffness: 150 }}
            style={{
              ...styles.analyticsOverviewCard,
              borderTop: `4px solid ${item.color}`,
            }}
          >
            <h3 style={{ ...styles.analyticsValue, color: item.color }}>
              {item.value}
            </h3>
            <p style={styles.analyticsLabel}>{item.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* WEEKLY TREND CHART */}
      <motion.div
        style={{ marginTop: "3rem" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 style={styles.sectionTitle}>Weekly Creation Trend</h3>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <LineChart
              data={usageTrend}
              margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="creations"
                stroke="#6c5ce7"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            backgroundColor: "#f9f8ff",
            borderRadius: "0.8rem",
            padding: "1rem",
            marginTop: "1rem",
            textAlign: "center",
            fontWeight: "600",
            color: "#555",
          }}
        >
          📈 You’ve had a <strong style={{ color: "#6c5ce7" }}>+12% growth</strong> in creations this week!
        </motion.div>
      </motion.div>

      {/* TOP TOOLS TABLE */}
      <motion.div
        style={{ marginTop: "3rem" }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h3 style={styles.sectionTitle}>Top Tools by Usage</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Tool Name</th>
              <th style={styles.th}>Usage Share</th>
            </tr>
          </thead>
          <tbody>
            {topTools.map((tool, i) => (
              <motion.tr
                key={i}
                whileHover={{ backgroundColor: "#f8f6ff" }}
                transition={{ duration: 0.15 }} // 🔹 reduced motion intensity
                style={styles.tr}
              >
                <td style={styles.td}>{tool.name}</td>
                <td
                  style={{
                    ...styles.td,
                    color: "#6c5ce7",
                    fontWeight: "700",
                  }}
                >
                  {tool.usage}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
