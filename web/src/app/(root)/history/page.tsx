"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import dynamic from "next/dynamic";

const Video = dynamic(() => import("next-video"), { ssr: false });

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#F5F6FA] p-8">
      <h2 className="text-2xl font-bold mb-6">Your Video Conversion History</h2>
      {loading && <div>Loading...</div>}
      {!loading && history.length === 0 && <div>No history found.</div>}
      <div className="grid gap-6 w-full max-w-3xl">
        {history.map((item) => (
          <Card key={item._id} className="p-4">
            <div className="mb-2 font-semibold">Prompt: {item.parameters.prompt}</div>
            <div className="mb-2 text-xs text-gray-500">Created: {new Date(item.createdAt).toLocaleString()}</div>
            <div className="mb-2">
              <span className="font-medium">Source Video:</span>
              <a href={item.sourceVideoUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 underline break-all">{item.sourceVideoUrl}</a>
            </div>
            <div className="mb-2">
              <span className="font-medium">Generated Video:</span>
              <a href={item.generatedVideoUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-green-600 underline break-all">{item.generatedVideoUrl}</a>
            </div>
            <div className="mb-2">
              <Video src={item.generatedVideoUrl} />
            </div>
            <details>
              <summary className="cursor-pointer">Parameters</summary>
              <pre className="bg-gray-100 p-2 rounded text-xs">{JSON.stringify(item.parameters, null, 2)}</pre>
            </details>
          </Card>
        ))}
      </div>
    </div>
  );
}