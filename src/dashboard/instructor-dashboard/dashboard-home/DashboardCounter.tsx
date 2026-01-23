"use client";
import { useEffect, useState } from "react";

type StatType = {
  id: number;
  icon: string;
  count: number;
  title: string;
};

const DashboardCounter = () => {
  const [dashboardStats, setDashboardStats] = useState<StatType[]>([]);

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setDashboardStats(data));
  }, []);

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {dashboardStats.map((stat) => (
        <div
          key={stat.id}
          style={{
            padding: 20,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 2px 8px #0001",
          }}
        >
          <div style={{ fontSize: 32 }}>{stat.count}</div>
          <div style={{ fontWeight: 700 }}>{stat.title}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCounter;
