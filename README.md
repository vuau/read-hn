# Read HN

Using the HackerNews API available at https://github.com/HackerNews/API to build a web app. Since the API only returns an array of IDs, it requires a large number of queries to retrieve the item details. Therefore, I have decided to use react-window to virtualize the list and reduce the number of requests in the list view.

## Feature
- Read shared links in reader view mode without opening a new tab

## Tech
- Bundler: Vite
- Language: Typescript
- Framework: React
- Navigation: React Router
- Data caching: React Query
- E2E Test: React Testing Library
- Unit Test: Jest
- Deployment: Vercel
