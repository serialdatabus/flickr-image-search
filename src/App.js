import { useCallback,useRef, useState } from "react";
import useFlickrSearch from "./useFlickrSearch";
import "./App.css";
import PhotoItem from "./PhotoItem";
import loading from "./loading.svg";
import search from "./search.svg";

function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [showSafeSearchSettings, setShowSafeSearchSettings] = useState(false);
  const [safeSearch, setSafeSearch] = useState(0);
  const safeSearchClasses = ["disabled", "safe", "moderate", "restricted"];


  //a new query will be fetched every time this variable changes inside the
  //useFlickrSearch Hook
  const [newQuery, setNewQuery] = useState(1);

  const { photos, isLoading, hasMore , error } = useFlickrSearch(
    query,
    page,
    safeSearch,
    newQuery
  );

  const observer = useRef();

  const searchPhoto = () => {
    setNewQuery((prev) => prev + 1);

    setQuery(query);

    setPage(1);
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

    setNewQuery((prev) => prev + 1);
  };

  const lastImageRef = useCallback(
    (node) => {
   
      if (isLoading) return;
      if(!hasMore) return;
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
          <img alt="" onClick={searchPhoto} src={search} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Tags , titile , description"
          />
        </div>
      </div>

      <div id="flickr-photos-container">
        {photos.map((item, index) => (
          <div className="column">
            {" "}
            {photos.length === index + 1 ? (
              <PhotoItem photodata={item} key={item.id} ref={lastImageRef} />
            ) : (
              <PhotoItem photodata={item} key={item.id} />
            )}{" "}
          </div>
        ))}
      </div>

      {isLoading && !error && <img alt="" className="loading" src={loading} />}
      {error && !isLoading && <h3 className="error-message">There was an error</h3>}
      {photos.length === 0 && !isLoading && <h3 className="no-result">There is no results</h3>}
    </div>
  );
}

export default App;
