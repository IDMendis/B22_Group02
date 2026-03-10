import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

import bg from "./assets/plant.jpg";

function Dashboard() {

  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);

  const fetchData = async () => {

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

      <Typography 
  variant="h3" 
  style={{
    color: "white",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", // Clean modern fonts
    fontWeight: 400,        // Makes it look elegant and thin
    letterSpacing: "2px",   // Adds a "premium" dashboard feel
    textAlign: "center",    // Centers it on the page
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)" // Makes it pop against the background image
  }}
>
  🌱 Smart Plant Monitoring Dashboard
</Typography>

      <Grid container spacing={3} style={{marginTop:"20px"}}>

        <Grid item xs={12} md={4}>
          <Card style={{background:"rgba(255,255,255,0.5)"}}>
            <CardContent>
              <Typography variant="h6">Moisture Level</Typography>
              <Typography variant="h3">
                {latest ? `${latest.moisture}%` : "--"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{background:"rgba(255,255,255,0.5)"}}>
            <CardContent>
              <Typography variant="h6">Pump Status</Typography>
              <Typography variant="h3">
                {latest && latest.pump === 1 ? "💧 ON" : "OFF"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{background:"rgba(255,255,255,0.5)"}}>
            <CardContent>
              <Typography variant="h6">System Status</Typography>
              <Typography variant="h5">Running</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Card style={{marginTop:"40px", background:"rgba(70, 97, 70, 0.65)", color:"white"}}>
        <CardContent>

          <Typography variant="h5" style={{ color: "#dce7dc", textAlign: "center", marginBottom: "20px" }}> {/* Light Green text */}
      Soil Moisture History
    </Typography>

       <LineChart width={800} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
      <XAxis dataKey="time" stroke="#ccc" /> 
      <YAxis stroke="#ccc" />
      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
      <Line type="monotone" dataKey="moisture" stroke="#81c784" strokeWidth={3} />
    </LineChart>
  </CardContent>
</Card>

    </div>

  );
}

export default Dashboard;