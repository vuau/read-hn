import {
  createBrowserRouter,
} from "react-router-dom";

import App from './App';
import List from './components/list';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <List />
      },
      {
        path: "posts/:tag",
        element: <List />
      },
      {
        path: "posts/:tag/:id",
        element: <List />
      }
    ]
  },
]);
