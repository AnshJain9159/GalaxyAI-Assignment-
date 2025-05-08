lient Library for JavaScript / TypeScript
Introduction
The client for JavaScript / TypeScript provides a seamless interface to interact with fal.

Installation
First, add the client as a dependency in your project:

npm
yarn
pnpm
bun
Terminal window
npm install --save @fal-ai/client

Features
1. Call an endpoint
Endpoints requests are managed by a queue system. This allows fal to provide a reliable and scalable service.

The subscribe method allows you to submit a request to the queue and wait for the result.

import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});

console.log(result.data);
console.log(result.requestId);

2. Queue Management
You can manage the queue using the following methods:

Submit a Request
Submit a request to the queue using the queue.submit method.

import { fal } from "@fal-ai/client";

const { request_id } = await fal.queue.submit("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});

This is useful when you want to submit a request to the queue and retrieve the result later. You can save the request_id and use it to retrieve the result later.

Webhooks

For long-running requests, such as training jobs, you can use webhooks to receive the result asynchronously. You can specify the webhook URL when submitting a request.

Check Request Status
Retrieve the status of a specific request in the queue:

import { fal } from "@fal-ai/client";

const status = await fal.queue.status("fal-ai/flux/dev", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});

Retrieve Request Result
Get the result of a specific request from the queue:

import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/flux/dev", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
});

console.log(result.data);
console.log(result.requestId);

3. File Uploads
Some endpoints require files as input. However, since the endpoints run asynchronously, processed by the queue, you will need to provide URLs to the files instead of the actual file content.

Luckily, the client library provides a way to upload files to the server and get a URL to use in the request.

import { fal } from "@fal-ai/client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);

4. Streaming
Some endpoints support streaming:

import { fal } from "@fal-ai/client";

const stream = await fal.stream("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
});

for await (const event of stream) {
  console.log(event);
}

const result = await stream.done();

5. Realtime Communication
For the endpoints that support real-time inference via WebSockets, you can use the realtime client that abstracts the WebSocket connection, re-connection, serialization, and provides a simple interface to interact with the endpoint:

import { fal } from "@fal-ai/client";

const connection = fal.realtime.connect("fal-ai/flux/dev", {
  onResult: (result) => {
    console.log(result);
  },
  onError: (error) => {
    console.error(error);
  },
});

connection.send({
  prompt: "a cat",
  seed: 6252023,
  image_size: "landscape_4_3",
  num_images: 4,
});

6. Run
The endpoints can also be called directly instead of using the queue system.

Prefer the queue

We do not recommend this use most use cases as it will block the client until the response is received. Moreover, if the connection is closed before the response is received, the request will be lost.

import { fal } from "@fal-ai/client";

const result = await fal.run("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
});

console.log(result.data);
console.log(result.requestId);

API Reference
For a complete list of available methods and their parameters, please refer to JavaScript / TypeScript API Reference documentation.

Examples
Check out some of the examples below to see real-world use cases of the client library:

See fal.realtime in action with SDXL Lightning: https://github.com/fal-ai/sdxl-lightning-demo-app
Support
If you encounter any issues or have questions, please visit the GitHub repository or join our Discord Community.

Migration from serverless-client to client
As fal no longer uses “serverless” as part of the AI provider branding, we also made sure that’s reflected in our libraries. However, that’s not the only thing that changed in the new client. There was lot’s of improvements that happened thanks to our community feedback.

So, if you were using the @fal-ai/serverless-client package, you can upgrade to the new @fal-ai/client package by following these steps:

Remove the @fal-ai/serverless-client package from your project:
Terminal window
npm uninstall @fal-ai/serverless-client

Install the new @fal-ai/client package:
Terminal window
npm install --save @fal-ai/client

Update your imports:
import * as fal from "@fal-ai/serverless-client";
import { fal } from "@fal-ai/client";

Now APIs return a Result<Output> type that contains the data which is the API output and the requestId. This is a breaking change from the previous version, that allows us to return extra data to the caller without future breaking changes.
const data = fal.subscribe(endpointId, { input });
const { data, requestId } = fal.subscribe(endpointId, { input });

Note

The fal object is now a named export from the package that represents a singleton instance of the FalClient and was added to make it as easy as possible to migrate from the old singleton-only client. However, starting in 1.0.0 you can create multiple instances of the FalClient with the createFalClient function.

Add fal.ai to your Next.js app
You will learn how to:
Install the fal.ai libraries
Add a server proxy to protect your credentials
Generate an image using SDXL
Prerequisites
Have an existing Next.js app or create a new one using npx create-next-app
Have a fal.ai account
Have an API Key. You can create one here
1. Install the fal.ai libraries
Using your favorite package manager, install both the @fal-ai/client and @fal-ai/server-proxy libraries.

npm
yarn
pnpm
Terminal window
npm install @fal-ai/client @fal-ai/server-proxy

2. Setup the proxy
The proxy will protect your API Key and prevent it from being exposed to the client. Usually app implementation have to handle that integration themselves, but in order to make the integration as smooth as possible, we provide a drop-in proxy implementation that can be integrated with either the Page Router or the App Router.

2.1. Page Router
If you are using the Page Router (i.e. src/pages/_app.js), create an API handler in src/pages/api/fal/proxy.js (or .ts in case of TypeScript), and re-export the built-in proxy handler:

export { handler as default } from "@fal-ai/server-proxy/nextjs";

2.2. App Router
If you are using the App Router (i.e. src/app/page.jsx) create a route handler in src/app/api/fal/proxy/route.js (or .ts in case of TypeScript), and re-export the route handler:

import { route } from "@fal-ai/server-proxy/nextjs";

export const { GET, POST } = route;

2.3. Setup the API Key
Make sure you have your API Key available as an environment variable. You can setup in your .env.local file for development and also in your hosting provider for production, such as Vercel.

Terminal window
FAL_KEY="key_id:key_secret"

2.4. Custom proxy logic
It’s common for applications to execute custom logic before or after the proxy handler. For example, you may want to add a custom header to the request, or log the request and response, or apply some rate limit. The good news is that the proxy implementation is simply a standard Next.js API/route handler function, which means you can compose it with other handlers.

For example, let’s assume you want to add some analytics and apply some rate limit to the proxy handler:

import { route } from "@fal-ai/server-proxy/nextjs";

// Let's add some custom logic to POST requests - i.e. when the request is
// submitted for processing
export const POST = (req) => {
  // Add some analytics
  analytics.track("fal.ai request", {
    targetUrl: req.headers["x-fal-target-url"],
    userId: req.user.id,
  });

  // Apply some rate limit
  if (rateLimiter.shouldLimit(req)) {
    res.status(429).json({ error: "Too many requests" });
  }

  // If everything passed your custom logic, now execute the proxy handler
  return route.POST(req);
};

// For GET requests we will just use the built-in proxy handler
// But you could also add some custom logic here if you need
export const GET = route.GET;

Note that the URL that will be forwarded to server is available as a header named x-fal-target-url. Also, keep in mind the example above is just an example, rateLimiter and analytics are just placeholders.

The example above used the app router, but the same logic can be applied to the page router and its handler function.

3. Configure the client
On your main file (i.e. src/pages/_app.jsx or src/app/page.jsx), configure the client to use the proxy:

import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

Protect your API Key

Although the client can be configured with credentials, use that only for rapid prototyping. We recommend you always use the proxy to avoid exposing your API Key in the client before you deploy your web application. See the server-side guide for more details.

4. Generate an image
Now that the client is configured, you can generate an image using fal.subscribe and pass the model id and the input parameters:

const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt,
    image_size: "square_hd",
  },
  pollInterval: 5000,
  logs: true,
  onQueueUpdate(update) {
    console.log("queue update", update);
  },
});

const imageUrl = result.images[0].url;

See more about Flux Dev used in this example on fal.ai/models/fal-ai/flux/dev.

What’s next?
Image generation is just one of the many cool things you can do with fal. Make sure you:

Check our demo application at github.com/fal-ai/serverless-js/apps/demo-nextjs-app-router
Check all the available Model APIs
Learn how to write your own model APIs on Introduction to serverless functions
Read more about function endpoints on private serverless models
Check the next page to learn how to deploy your app to Vercel
