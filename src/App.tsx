import React, { Dispatch, SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useLocalStorage } from "usehooks-ts";
import './App.css';

type BookmarksContextType = {
  bookmarks: number[];
  setBookmarks: Dispatch<SetStateAction<number[]>>;
  removeBookmarks: () => void;
};

export const BookmarksContext = React.createContext<BookmarksContextType>({
  bookmarks: [],
  setBookmarks: () => {},
  removeBookmarks: () => {}
});

function App() {
  const [bookmarks, setBookmarks, removeBookmarks] = useLocalStorage<number[]>("bookmarks", []);
  const contextValue = {
    bookmarks,
    setBookmarks,
    removeBookmarks
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <BookmarksContext.Provider value={contextValue}>
        <Outlet />
      </BookmarksContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
