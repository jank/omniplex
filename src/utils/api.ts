export const handleMode = async (text: string) => {
  try {
    const response = await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        {
          role: "system",
          content:
            `You are a helpful assistant with access to the following functions. You MUST respond with function calls ONLY -
    [
    {
      type: "function",
      function: {
        name: "search",
        description: "Search for information based on a query",
        parameters: {
          type: "object",
          properties: {},
        },
      },
    },
    {
      type: "function",
      function: {
        name: "dictionary",
        description: "Get dictionary information for a given word",
        parameters: {
          type: "object",
          properties: {
            word: {
              type: "string",
              description: "Word to look up in the dictionary.",
            },
          },
          required: ["word"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "weather",
        description: "Get the current weather in a given location",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "City name to fetch the weather for.",
            },
          },
          required: ["location"],
        },
      },
    },
    }]

To use these functions respond with:
{"mode": "function_name","arg":{"arg_1": "value_1", "arg_2": "value_2" , ...}}

Edge cases you must handle:
 - If there are no functions that matches the user request, wrap it into the search function.
`        },
        { role: "user", content: text },
      ]),
    });
    const data = await response.json();
    return { mode: data.mode, arg: data.arg };
  } catch (error) {
    console.error("Error fetching mode and arguments:", error);
    throw error;
  }
};