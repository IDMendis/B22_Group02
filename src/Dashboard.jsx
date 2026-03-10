import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import bg from "./assets/plant.jpg";

function Dashboard() {

  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);

  const fetchData = async () => {

    try {

      const res = await axios.get(
        "https://api.thingspeak.com/channels/3272861/feeds.json?results=50"
      );

      const feeds = res.data.feeds;

      const formatted = feeds.map((item) => ({
        time: new Date(item.created_at).toLocaleTimeString(),
        moisture: Number(item.field1),
        pump: Number(item.field2)
      }));

      setData(formatted);
      setLatest(formatted[formatted.length - 1]);

    } catch (error) {
      console.error("Error fetching data:", error);
    }

  };

  useEffect(() => {

    fetchData();

    const interval = setInterval(fetchData, 15000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        padding: "40px"
      }}
    >

      {/* KEEPING YOUR TYPOGRAPHY EXACTLY SAME */}

      <Typography 
        variant="h3" 
        style={{
          color: "white",
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontWeight: 400,
          letterSpacing: "2px",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          marginBottom: "50px"
        }}
      >
        🌱 Smart Plant Monitoring Dashboard
      </Typography>

      <Grid container spacing={3} style={{marginTop:"20px"}}>

        {/* Moisture Gauge */}

        <Grid item xs={12} md={4}>
          <Card style={{
            background:"rgba(255,255,255,0.31)",
            // backdropFilter:"blur(10px)"
          }}>
            <CardContent>

              <Typography variant="h6">Moisture Level</Typography>

              <div style={{width:"120px", margin:"20px auto"}}>

                {latest && (
                  <CircularProgressbar
                    value={latest.moisture}
                    text={`${latest.moisture}%`}
                  />
                )}

              </div>

              {latest && latest.moisture < 25 && (
                <Typography style={{color:"red"}}>
                  ⚠ Soil is Dry
                </Typography>
              )}

            </CardContent>
          </Card>
        </Grid>

        {/* Pump Status */}

        <Grid item xs={12} md={4}>
          <Card style={{
            background:"rgba(255, 255, 255, 0.31)",
            backdropFilter:"blur(10px)"
          }}>
            <CardContent>

              <Typography variant="h6">Pump Status</Typography>

              <Typography variant="h3">
                {latest && latest.pump === 1 ? "💧 ON" : "OFF"}
              </Typography>

              {latest && latest.pump === 1 && (
                <Typography style={{color:"blue"}}>
                  Watering Plant...
                </Typography>
              )}

            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}

        <Grid item xs={12} md={4}>
          <Card style={{
            background:"rgba(255,255,255,0.31)",
            backdropFilter:"blur(10px)"
          }}>
            <CardContent>

              <Typography variant="h6">System Status</Typography>
              <Typography variant="h5">Running</Typography>

              <Typography variant="body2">
                Auto refresh every 15 sec
              </Typography>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Moisture History */}

      <Card style={{
        marginTop:"40px",
        background:"rgba(70, 97, 70, 0.35)",
        color:"white",
        backdropFilter:"blur(10px)"
      }}>
        <CardContent>

          <Typography 
            variant="h5" 
            style={{ color: "#dce7dc", textAlign: "center", marginBottom: "20px" }}
          >
            Soil Moisture History
          </Typography>

          <ResponsiveContainer width="100%" height={320}>

            <LineChart data={data}>

              <CartesianGrid strokeDasharray="3 3" stroke="#555" />

              <XAxis dataKey="time" stroke="#ccc" />

              <YAxis stroke="#ccc" />

              <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />

              <Line
                type="monotone"
                dataKey="moisture"
                stroke="#81c784"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </CardContent>
      </Card>

    </div>

  );
}

export default Dashboard;