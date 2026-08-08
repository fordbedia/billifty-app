---
name: run-test
description: Use to run all module's unit test
---

# Laravel Unit Test

Run this steps:
1. Run command: `docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend bash`
2. Now once in the shell, run: `cd ..` and then `cd shared-resources/`
3. Next, run: `composer test`
4. If no errors found, show a success message and some goodies.
5. Otherwise, if it throws an error, show the error message, analyze each errors, figure out how to solve them and proceed with a plan.
6. Once the plan is displayed, ask if the user wants to continue with the fixes - Yes or No.
7. If yes, proceed with ALL the fixes and show the success message.
8. If no, then stop the process.
