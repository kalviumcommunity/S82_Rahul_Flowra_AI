// backend/judgePrompt.js

export const judgePrompt = (modelOutput, expected) => {
  let score = 0;
  let feedback = [];

  // ✅ Check if required pages exist
  if (expected.must_include_pages) {
    expected.must_include_pages.forEach((page) => {
      if (modelOutput?.pages?.includes(page)) {
        score += 1;
      } else {
        feedback.push(`Missing required page: ${page}`);
      }
    });
  }

  // ✅ Check if tone matches (rough validation)
  if (
    expected.tone &&
    modelOutput?.description?.toLowerCase().includes(expected.tone.toLowerCase())
  ) {
    score += 1;
  } else {
    feedback.push(`Tone mismatch: expected ${expected.tone}`);
  }

  return {
    passed: score >= 2, // ✅ Pass if all conditions met
    score,
    feedback
  };
};
