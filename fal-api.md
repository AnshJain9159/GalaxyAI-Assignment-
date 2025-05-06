Here's a condensed and well-formatted version of the Hunyuan Video API documentation for PDF conversion:

---

# **Fal.ai Hunyuan Video API Documentation**  
*Fast Text-to-Video & Video-to-Video Generation*  

---

## **1. API Integration**  
### **Installation**  
```bash
npm install --save @fal-ai/client
# Or: yarn / pnpm / bun equivalent
```

### **Authentication**  
Set API key via environment variable:  
```bash
export FAL_KEY="YOUR_API_KEY"
```  
Or configure manually:  
```javascript
import { fal } from "@fal-ai/client";
fal.config({ credentials: "YOUR_FAL_KEY" });
```

---

## **2. Video Generation**  
### **Basic Request**  
```javascript
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/hunyuan-video/video-to-video", {
  input: {
    prompt: "A stylish woman walks down a Tokyo street...",
    video_url: "https://storage.googleapis.com/falserverless/hunyuan_video/hunyuan_v2v_input.mp4"
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  }
});
```

---

## **3. Queue Management**  
### **Submit Background Job**  
```javascript
const { request_id } = await fal.queue.submit("fal-ai/hunyuan-video/video-to-video", {
  input: { /* ... */ },
  webhookUrl: "https://optional.webhook.url/for/results"
});
```

### **Check Status**  
```javascript
const status = await fal.queue.status("fal-ai/hunyuan-video/video-to-video", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true
});
```

### **Get Result**  
```javascript
const result = await fal.queue.result("fal-ai/hunyuan-video/video-to-video", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b"
});
```

---

## **4. File Handling**  
### **Supported Inputs**  
- Public URLs (e.g., `https://example.com/video.mp4`)  
- Base64 data URIs (e.g., `data:video/mp4;base64,...`)  

### **Upload Files**  
```javascript
const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
```

---

## **5. Input Schema**  
| Parameter             | Type     | Default       | Description                          |
|----------------------|----------|---------------|--------------------------------------|
| `prompt`             | string   | -             | Text description for video generation |
| `video_url`          | string   | -             | Input video URL (Video-to-Video)     |
| `num_inference_steps`| integer  | 30            | Inference steps (lower=faster, higher=better) |
| `aspect_ratio`       | enum     | "16:9"        | Options: `16:9`, `9:16`              |
| `resolution`         | enum     | "720p"        | Options: `480p`, `580p`, `720p`      |
| `num_frames`         | enum     | 129           | Options: `129`, `85`                 |
| `strength`           | float    | 0.85          | Video-to-Video strength parameter      |
| `seed`               | integer  | -             | Random seed for reproducibility      |
| `pro_mode`           | boolean  | false         | Use 55 steps (higher quality, 2x cost) |
| `enable_safety_checker` | boolean | true        | Enable NSFW content filtering          |

---

## **6. Output Schema**  
```json
{
  "video": {
    "url": "https://v3.fal.media/files/kangaroo/y5-1YTGpun17eSeggZMzX_video-1733468228.mp4"
  },
  "seed": 123456789
}
```

---

## **7. Advanced Types**  
### **LoraWeight**  
```typescript
{
  path: "https://lora.weights.url",
  scale: 1.0
}
```

### **File Object**  
```typescript
{
  url: string,
  content_type: string,
  file_name: string,
  file_size: number,
  file_data: string
}
```

---

**Tips**  
- Use server-side proxies to protect API keys in client-side apps  
- Pro mode doubles cost but improves quality (55 vs 35 steps)  
- Large files: Prefer hosted URLs over Base64 for performance  

--- 