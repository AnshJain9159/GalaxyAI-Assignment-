/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Document, models, model } from "mongoose";

export interface IVideoHistory extends Document {
  userId: string;
  sourceVideoUrl: string;
  generatedVideoUrl?: string | null;
  parameters: Record<string, any>;
  status: "pending" | "completed" | "failed";
  output?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  falRequestId?: string;
}

const VideoHistorySchema = new Schema<IVideoHistory>(
  {
    userId: { type: String, required: true },
    sourceVideoUrl: { type: String, required: true },
    generatedVideoUrl: { type: String, default: null },
    parameters: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    output: { type: Schema.Types.Mixed, default: null },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    falRequestId: { type: String, default: null },
  },
  { collection: "video_histories" }
);

export default models.VideoHistory ||
  model<IVideoHistory>("VideoHistory", VideoHistorySchema);