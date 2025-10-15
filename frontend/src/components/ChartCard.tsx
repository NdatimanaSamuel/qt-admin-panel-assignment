import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/app/hooks";
import type { RootState } from "../redux/app/hooks";
import { fetchWeeklyUserStats } from "../redux/features/users/usersSlice";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ChartCard = () => {
  const dispatch = useAppDispatch();
 const { data, isLoading } = useAppSelector(
  (state: RootState) => state.auth.weeklyStats
);

  useEffect(() => {
    dispatch(fetchWeeklyUserStats());
  }, [dispatch]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full h-80">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        👥 Users Created (Last 7 Days)
      </h2>

      {isLoading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="day" tick={{ fill: "#4b5563" }} />
            <YAxis tick={{ fill: "#4b5563" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#3b82f6" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ChartCard;
