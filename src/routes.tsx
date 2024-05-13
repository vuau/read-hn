import { createBrowserRouter } from "react-router-dom";
// import App from "./App";
// import List from "./components/list";
import AppNews from "./AppNews";
import ListNews from "./components/list-news";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppNews />,
    children: [
      {
        path: "/",
        element: <ListNews />,
      },
      {
        path: "news/:tag",
        element: <ListNews />,
      },
      {
        path: "news/:tag?url=:url",
        element: <ListNews />,
      },
    ],
  },
  // {
  //   path: "/",
  //   element: <App />,
  //   children: [
  //     {
  //       path: "/",
  //       element: <List />,
  //     },
  //     {
  //       path: "posts/:tag",
  //       element: <List />,
  //     },
  //     {
  //       path: "posts/:tag/:id",
  //       element: <List />,
  //     },
  //   ],
  // },
]);
