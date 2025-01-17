const systemPrompt = `You are an expert tailwind developer. A user will provide you with a
 low-fidelity wireframe of an application and you will return 
 a single html file that uses tailwind to create the website. Use creative license to make the application more fleshed out.
if you need to insert an image, use placehold.co to create a placeholder image. Respond only with the html file.`;

export async function POST(request: Request) {
  const { image } = await request.json();
  const body: GPT4VCompletionRequest = {
    model: "Open-Orca/Mistral-7B-OpenOrca",
    max_tokens: 500,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: image, detail: "high" },
          },
          "Turn this into a single html file using tailwind.",
        ],
      },
    ],
  };

  let json = null;
  try {
    const resp = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer f722a9f6e3afd6b9999e6aee02aeac9e751ea3a67b124c3667ab50c85c7fa99e`,
      },
      body: JSON.stringify(body),
    });
    json = await resp.json();
  } catch (e) {
    console.log(e);
  }

  return new Response(JSON.stringify(json), {
    headers: {
      "content-type": "application/json; charset=UTF-8",
    },
  });
}

type MessageContent =
  | string
  | (
      | string
      | {
          type: "image_url";
          image_url: string | { url: string; detail: "low" | "high" | "auto" };
        }
    )[];

export type GPT4VCompletionRequest = {
  model: "Open-Orca/Mistral-7B-OpenOrca";
  messages: {
    role: "system" | "user" | "assistant" | "function";
    content: MessageContent;
    name?: string | undefined;
  }[];
  functions?: any[] | undefined;
  function_call?: any | undefined;
  stream?: boolean | undefined;
  temperature?: number | undefined;
  top_p?: number | undefined;
  max_tokens?: number | undefined;
  n?: number | undefined;
  best_of?: number | undefined;
  frequency_penalty?: number | undefined;
  presence_penalty?: number | undefined;
  logit_bias?:
    | {
        [x: string]: number;
      }
    | undefined;
  stop?: (string[] | string) | undefined;
};
