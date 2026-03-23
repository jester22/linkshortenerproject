---
description: Read this file to understand the data fetching strategies and best practices for the Link Shortener Project.
---
# Data Fetching Strategies for Link Shortener
This document outlines the recommended data fetching strategies for the Link Shortener project, ensuring efficient and secure access to data across the application.

## 1. Use Server Components for Data Fetching
In Next.js 16, ALWAYS Server Components to fetch data directly on the server. NEVER fetch data in Client Components unless absolutely necessary.

## 2. Data Fetching Methods
ALWAYS use the helper functions in the /data directory to fetch data. NEVER fetch data directly in components.

ALL helper functions in the /data directory should use Drizzle ORM to interact with the PostgreSQL database. NEVER use raw SQL queries or other database libraries.