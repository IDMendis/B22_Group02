import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function Dashboard() {

  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);

  const fetchData = async () => {

    try {

      const res = await axios.get(
        "https://api.thingspeak.com/channels/3272861/feeds.json?results=20"
      );

      const feeds = res.data.feeds;

      const formatted = feeds.map((item) => ({
        time: new Date(item.created_at).toLocaleTimeString(),
        moisture: Number(item.field1),
        pump: Number(item.field2)
      }));

      setData(formatted);
      setLatest(formatted[formatted.length - 1]);

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {

    fetchData();

    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div style={{ padding: "30px" }}>

      <h1>🌱 Smart Plant Monitoring Dashboard</h1>

      {latest && (
        <div>
          <h2>Moisture: {latest.moisture}%</h2>
          <h2>Pump: {latest.pump === 1 ? "💧 ON" : "OFF"}</h2>
        </div>
      )}

      <LineChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time"/>
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="moisture" stroke="#00a86b"/>
      </LineChart>

    </div>
  );
}

export default Dashboard;