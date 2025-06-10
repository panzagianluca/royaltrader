# Cursor Task Execution Prompt

When I assign you a task, please follow the procedure below carefully and thoroughly:

---

## 1. Understand the Task
- Begin by **summarizing the task** in your own words to confirm your understanding.
- If anything is unclear or ambiguous, **ask me clarifying questions** before proceeding.
- Keep the scope focused by **separating concerns:** avoid trying to solve multiple unrelated problems at once. Limit prompts to 1 or 2 main questions.

## 2. Apply @sequential_thinking mcp
- Always apply the `@sequential_thinking mcp` mindset. This means:
  - Break down the problem logically and address it **step-by-step**.
  - Use structured, **chain reasoning** to solve complex tasks, e.g., "First identify A, then analyze B, finally summarize C."

## 3. Root Cause Focus
- Follow the principle: **"Fix the root cause, not the symptom."**
- Identify and address the underlying cause of any issues or bugs rather than surface-level symptoms to avoid wasted time and repeated errors.

## 4. Plan Before Coding or Executing
- Before starting any implementation or solution:
  - **Outline a detailed, step-by-step plan** for how you will approach the task.
  - For example, "Break down how to implement X before coding."
  - Share this plan with me to confirm before execution.

## 5. Use Examples to Clarify Expectations
- Whenever applicable, use **sample inputs and expected outputs** to clarify what the task requires.
- For example:  
  _Given `[1, 2, 3]`, return `[1, 4, 9]` using a map function._

## 6. Execute Step-by-Step
- Follow the approved plan and execute the task **step-by-step**.
- After completing each step, **confirm completion** and optionally surface any uncertainties before proceeding.

## 7. Maintain and Update Task Lists and Documentation
- Keep an up-to-date **task list** reflecting progress and next steps.
- Document the task design, assumptions, context, or any decisions during the process. This will serve as a reference to ensure clarity in follow-up prompts.
- **IMPORTANT**: Whenever a change is made to the codebase (new component, new functionality, adding/removing pages), update `structure.md` to reflect these changes. This maintains an accurate representation of the application structure.

## 8. Review and Confirm
- After finishing the task, **review your work thoroughly** to ensure accuracy and completeness.
- Verify that the root cause was addressed, the solution meets the requirements, and there are no overlooked errors.

## 9. Provide a Clear Summary
- Summarize what you have done, highlighting:
  - The approach taken.
  - Key findings or decisions.
  - Next recommended actions or any outstanding issues.

## 10. Manage Diminishing Returns
- Recognize that long conversations may produce diminishing returns.
- When a session reaches a plateau or starts becoming less productive, suggest starting a fresh session with a clean context to refresh the process.

---

**Remember:**  
If you ever encounter unclear or gray areas, **ask me questions** to uncover assumptions and clarify expectations. Transparency and stepwise clarity are critical for efficient and effective outcomes.

---

*Please adhere strictly to this workflow to maximize quality and maintain clear communication on all tasks.*
