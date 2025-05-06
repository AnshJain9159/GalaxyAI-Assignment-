import  { Schema, Document, models, model } from "mongoose";

export interface IVideoHistory extends Document {
  userId: string;
  sourceVideoUrl: string;
  generatedVideoUrl: string;
  parameters: Record<string, any>;
  createdAt: Date;
}

const VideoHistorySchema = new Schema<IVideoHistory>(
  {
    userId: { type: String, required: true },
    sourceVideoUrl: { type: String, required: true },
    generatedVideoUrl: { type: String, required: true },
    parameters: { type: Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "video_histories" }
);

export default models.VideoHistory ||
  model<IVideoHistory>("VideoHistory", VideoHistorySchema);