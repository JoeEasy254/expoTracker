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
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "January",
    MonthlyTarget: 4000,
    saving: 2400,
    amt: 2400,
  },
  {
    name: "February",
    MonthlyTarget: 4000,
    saving: 2400,
    amt: 2400,
  },
  {
    name: "March",
    MonthlyTarget: 4000,
    saving: 2400,
    amt: 2400,
  },
  {
    name: "April",
    MonthlyTarget: 4000,
    saving: 2400,
    amt: 2400,
  },
  {
    name: "May",
    MonthlyTarget: 4000,
    saving: 2400,
    amt: 2400,
  },
  {
    name: "June",
    MonthlyTarget: 4000,
    saving: 2400,
    amt: 2400,
  },
  {
    name: "July",
    MonthlyTarget: 4000,
    saving: 2400,
    amt: 2400,
  },
];

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
    <div>
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
          activeBar={<Rectangle fill="gold" stroke="purple" />}
        />
      </BarChart>
    </div>
  );
}
