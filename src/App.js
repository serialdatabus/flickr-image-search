import { useCallback, useRef, useState } from "react";
import useFlickrSearch from "./useFlickrSearch";
import "./App.css";
import PhotoItem from "./PhotoItem";
import loadingIcon from "./loading.svg";
import searchIcon from "./search.svg";
import textIcon from "./text-font.svg";
import hashtagIcon from "./hashtag.svg";

function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("text");
  const [showSafeSearchSettings, setShowSafeSearchSettings] = useState(false);
  const [safeSearch, setSafeSearch] = useState(0);
  const safeSearchClasses = ["disabled", "safe", "moderate", "restricted"];

  //a new query will be fetched every time this variable changes inside the
  //useFlickrSearch Hook
  const [newQuery, setNewQuery] = useState(1);

  const { photos, isLoading, hasMore, error } = useFlickrSearch(
    query,
    page,
    safeSearch,
    newQuery,
    searchType
  );

  const observer = useRef();

  const searchPhoto = () => {

    setQuery(query);

    setPage(1);

    forceQuery();

  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchPhoto();
    }
  };

  const handleSettingsSafeSarch = (e, level) => {
    e.stopPropagation();

    setSafeSearch(level);
    setShowSafeSearchSettings(false);

    forceQuery();
  };

  const forceQuery = () => {
    setNewQuery((prev) => prev + 1);

  }

  const onTagSearch = (tag) => {

    console.log(tag);

    setSearchType("tags");
    setQuery(tag);

    forceQuery();


  }

  const lastImageRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (!hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore]
  );

  return (
    <div className="App">
      <div
        id="safe-search-settings"
        className={showSafeSearchSettings ? "show" : ""}
        onClick={(e) => setShowSafeSearchSettings(false)}
      >
        {safeSearchClasses.map((item, index) => (
          <button
            key={item}
            onClick={(e) => handleSettingsSafeSarch(e, index)}
            className={item}
          >
            {item}
          </button>
        ))}
      </div>

      <div id="topbar">
        <div className="safe-search-container">
          <span>Safe search setting:</span>
          <button
            onClick={() => setShowSafeSearchSettings(true)}
            className={safeSearchClasses[safeSearch]}
          >
            {safeSearchClasses[safeSearch]}
          </button>
        </div>

        <div className="search-container">
          <img alt="" onClick={searchPhoto} src={searchIcon} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder=""
          />

          {searchType === "text" && (
            <img
              alt=""
              className="btn-search-type"
              onClick={() => setSearchType("tags")}
              src={textIcon}
            />
          )}
          {searchType === "tags" && (
            <img
              alt=""
              className="btn-search-type"
              onClick={() => setSearchType("text")}
              src={hashtagIcon}
            />
          )}
        </div>
      </div>

      <div id="flickr-photos-container">
        {photos.map((item, index) => {

            const refPros= {

                ref: photos.length === (index + 1) ? lastImageRef : null

            }
       

          return (
            <div className="column">
              <PhotoItem
                onTagSearch={onTagSearch}
                photodata={item}
                key={item.id}
                {...refPros}
              />
            </div>
          );
        })}
      </div>

      {isLoading && !error && (
        <img alt="" className="loading" src={loadingIcon} />
      )}
      {error && !isLoading && (
        <h3 className="error-message">There was an error</h3>
      )}
      {photos.length === 0 && !isLoading && (
        <h3 className="no-result">There is no results</h3>
      )}
    </div>
  );
}

export default App;
