export class SupportAgent {
  async handle(input: { message: string }) {
    return {
      agent: "support",
      response:
        "I can help with general support questions, FAQs, and troubleshooting.",
      reasoning: ["Classified as general support", "Used support agent fallback response"]
    };
  }
}
