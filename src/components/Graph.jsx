import { db } from "@/lib/firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function Graph({ userId }) {
  const [graphData, setGraphData] = useState([]);

  async function fetchGraphData() {
    try {
      const q = query(
        collection(db, "accounts"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(q);
      const temp = [];
      querySnapshot.forEach((doc) => {
        temp.push(doc.data());
      });

      setGraphData(temp);
    } catch (error) {
      console.log("error  fetching data", error);
    }
  }

  useEffect(() => {
    fetchGraphData();
  }, [userId]);

  // Prepare graphData based on the structure of your input data
  const graph = graphData[0]?.monthlyAccountSavings.map((item) => {
    return {
      month: item.month,
      depositAmount: graphData[0].depositAmount,
      monthlyTarget: parseInt(item.monthlyTarget),
      savingTarget: parseInt(graphData[0].savingTarget),
    };
  });

  return (
    <div style={{ height: 500, overflowX: "auto" }}>
      <BarChart
        width={500}
        height={300}
        data={graph}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis dataKey="savingTarget" />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="depositAmount"
          fill="#8884d8"
          activeBar={<Rectangle fill="pink" stroke="blue" />}
        />
        <Bar
          dataKey="monthlyTarget"
          fill="#82ca9d"
          activeBar={<Rectangle fill="gold" stroke="#82ca9d" />}
        />
      </BarChart>
    </div>
  );
}
