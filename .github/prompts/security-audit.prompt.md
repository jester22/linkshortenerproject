---
name: security-audit
description: Describe when to use this prompt
agent: ask
---

<!-- Tip: Use /create-prompt in chat to generate content with agent assistance -->

Perform  a security audit of the codebase to identify potential vulnerabilities and recommend improvements.

Output your findings as a markdown formatted table with the following columns: "ID" (should start at 1 and auto-increment), "Severity", "Issue", "File Path" (should be an actual link to the file), "Line Number(s)", and "Recommendation".

Next, ask the user which issues they want to fix by either replying "all" or providing a comma-separated list of issue IDs. After the user responds, launch a **separate sub-agent** (`#runSubagent`) for **each individual issue**. Do NOT batch multiple issues into a single sub-agent — every issue ID must get its own dedicated sub-agent invocation with a focused prompt describing only that issue's fix.

Each sub-agent should:
1. Read the relevant file(s) before making changes.
2. Apply the fix for its assigned issue only.
3. Report back with `subAgentSuccess: true` if the fix was applied successfully, or `subAgentSuccess: false` with an explanation if it failed.

After all sub-agents complete, provide a summary table of results. If any issues were not successfully fixed, list those separately with the failure reasons.