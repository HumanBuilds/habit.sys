---
description: Manual Feature Verification using Browser Subagent
---

1. **Define Test Scenarios**
   List the specific "Happy Path" scenarios to verify. Define the expected outcome for each.
   *Example: "User clicks login -> Enters valid creds -> Redirects to Dashboard"*

2. **Start Development Server**
   Ensure the development server is running to serve the application.
   // turbo
   npm run dev

3. **Execute Browser Tests**
   Use the `browser_subagent` tool to perform the verification steps.
   - Navigate to the target URL (e.g., http://localhost:3000).
   - Perform the interactions defined in your scenarios.
   - **Crucial**: Take screenshots of the final state or any error messages.

4. **Report Findings**
   Conclude the task by summarizing the results of the manual test.
   - PASS: feature works as expected.
   - FAIL: describe the deviation and any observed errors.
