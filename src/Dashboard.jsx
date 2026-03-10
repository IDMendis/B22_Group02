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

      <Typography variant="h3" style={{color:"white"}}>
        🌱 Smart Plant Monitoring Dashboard
      </Typography>

      <Grid container spacing={3} style={{marginTop:"20px"}}>

        <Grid item xs={12} md={4}>
          <Card style={{background:"rgba(255,255,255,0.8)"}}>
            <CardContent>
              <Typography variant="h6">Moisture Level</Typography>
              <Typography variant="h3">
                {latest ? `${latest.moisture}%` : "--"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{background:"rgba(255,255,255,0.8)"}}>
            <CardContent>
              <Typography variant="h6">Pump Status</Typography>
              <Typography variant="h3">
                {latest && latest.pump === 1 ? "💧 ON" : "OFF"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card style={{background:"rgba(255,255,255,0.8)"}}>
            <CardContent>
              <Typography variant="h6">System Status</Typography>
              <Typography variant="h5">Running</Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Card style={{marginTop:"40px", background:"rgba(255,255,255,0.9)"}}>
        <CardContent>

          <Typography variant="h6">
            Soil Moisture History
          </Typography>

          <LineChart width={800} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="time"/>
            <YAxis/>
            <Tooltip/>
            <Line type="monotone" dataKey="moisture" stroke="#2e7d32"/>
          </LineChart>

        </CardContent>
      </Card>

    </div>

  );
}

export default Dashboard;