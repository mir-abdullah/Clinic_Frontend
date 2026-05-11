"use client"
import { count } from "console";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export const WeeklyPatientCount = () => {
    const data = [
        { day: "Mon", count: 3000 },
        { day: "Tue", count: 5000 },
        { day: "Wed", count: 6000 },
        { day: "Thu", count: 4000 },
        { day: "Fri", count: 2000 },
        { day: "Sat", count: 7000 },
        { day: "Sun", count: 0 }
    ];

    return (
        <div className="bg-(--bg-primary) border border-border rounded-[16px] px-6 py-5">
            <h2 className="text-lg font-semibold text-(--text-primary) mb-6">Weekly Revenue</h2>
            <ResponsiveContainer width="40%" height={300}>
                <BarChart data={data}>
                    {/* <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} /> */}
                    <XAxis dataKey="day" stroke="var(--text-secondary)" />
                    <YAxis stroke="var(--text-secondary)" />
                    <Tooltip 
                        formatter={(value) => value}
                        contentStyle={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                    />
                    <Bar dataKey="count" fill="#93c5e8" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}