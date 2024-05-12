# Read HN

Using the HackerNews API available at https://github.com/HackerNews/API to build a web app. Since the API only returns an array of IDs, it requires a large number of queries to retrieve the item details. Therefore, I have decided to use react-window to virtualize the list and reduce the number of requests in the list view.

## Features
- Clean UI with dark mode support
- Read shared links in reader view mode without opening a new tab
- Double tab to collapse comments

<table>
  <tr>
    <td valign="top">
      <img src="https://github.com/vuau/read-hn/assets/259848/696f3512-7c89-44a9-9486-85dc143759dc" alt="home page's screenshot" width="300" />
    </td>
    <td>
      <img src="https://github.com/vuau/read-hn/assets/259848/863abc71-0733-4ab5-8fe1-8d49b6a8f9b1" alt="screenshot of an article in reader view mode" width="300" /> 
    </td>
    <td>
      <img src="https://github.com/vuau/read-hn/assets/259848/4e7eaa0d-b797-4b54-bc10-83e6469e3814" alt="screenshot of comments" width="300" />
    </td>
  </tr>
</table>

## Tech
- Bundler: Vite
- Language: Typescript
- Framework: React
- Navigation: React Router
- Data caching: React Query
- Unit Test: Jest & React Testing Library
- Deployment: Vercel
