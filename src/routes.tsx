import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import List from "./components/list";
import ListNews from "./components/list-news";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ListNews />,
      },
      {
        path: "doc-bao/:tag",
        element: <ListNews />,
      },
      {
        path: "doc-bao/:tag?url=:url",
        element: <ListNews />,
      },
      {
        path: "posts/:tag",
        element: <List />,
      },
      {
        path: "posts/:tag/:id",
        element: <List />,
      },
    ],
  },
]);
