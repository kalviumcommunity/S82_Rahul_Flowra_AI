import { encode } from "gpt-3-encoder";

/**
 * Count the number of tokens in a text
 * @param {string} text
 * @returns {number} token count
 */
export const countTokens = (text) => {
  if (!text) return 0;
  const encoded = encode(text);
  return encoded.length;
};

/**
 * Log tokens for system + user messages or raw API response
 * @param {Array|Object} messages - array of {role, content} or OpenRouter API response
 * @param {string} context - optional label for logging (e.g., "Zero-Shot")
 * @returns {number} total tokens
 */
export const logTokens = (messages, context = "Request") => {
  let totalTokens = 0;

  // If it's an OpenRouter response, try to extract usage.total_tokens
  if (messages?.usage?.total_tokens) {
    totalTokens = messages.usage.total_tokens;
    console.log(`⚡ [${context}] Total tokens used (from API): ${totalTokens}`);
    return totalTokens;
  }

  // Otherwise assume it's an array of messages
  if (Array.isArray(messages)) {
    messages.forEach((msg) => {
      const tokens = countTokens(msg.content);
      totalTokens += tokens;
      console.log(
        `Role: ${msg.role} | Tokens: ${tokens} | Content: "${msg.content.substring(0,50)}..."`
      );
    });
    console.log(`✅ [${context}] Total tokens in request: ${totalTokens}`);
  }

  return totalTokens;
};
