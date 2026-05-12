"use client"
import { count } from "console";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"


type Data={
    day: string;
    count: number;
}

export const WeeklyPatientCount = ({data}: {data: Data[]}) => {

    
    const data1 = [
        { day: "Mon", count: 30 },
        { day: "Tue", count: 50 },
        { day: "Wed", count: 60 },
        { day: "Thu", count: 40 },
        { day: "Fri", count: 20 },
        { day: "Sat", count: 70 },
        { day: "Sun", count: 0 }
    ];

    return (
        <div className="bg-(--bg-primary) border border-border rounded-[16px] px-6 py-5 w-120">
            <h2 className="text-lg font-semibold text-(--text-primary) mb-6">Weekly Revenue</h2>
            <hr className="border-border my-4" />
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data1}>
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