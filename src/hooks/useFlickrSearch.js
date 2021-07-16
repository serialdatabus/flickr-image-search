import { useEffect, useState } from "react";
import axios from "axios";

const useFlickrSearch = (query, page, safesearch, newquery , searchtype) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(false);

  if(searchtype==="tags")
  {
    query = query.trim().split(" ").join(",");
  }

  console.log(query);

  const API_KEY = "3dff7db06ae123c0eeaf76682aea06d1";

  useEffect(() => {
    setPhotos([]);
  }, [safesearch, newquery]);

  useEffect(() => {
    let cancel;
    setIsLoading(true);
    setError(false);
    const method =
      query.trim() === "" ? "flickr.photos.getrecent" : "flickr.photos.search";
    const extras = "description,path_alias,tags,url_m,owner_name";
    const per_page = 20;
    const format = "json";
    const nojsoncallback = 1;
    axios({
      method: "GET",
      url: "https://api.flickr.com/services/rest/",
      params: {
        method,
        page,
        extras,
        per_page,
        format,
        [searchtype]: query,
        api_key: API_KEY,
        nojsoncallback,
        safe_search: safesearch,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        const _photos = res.data.photos.photo;

        setPhotos((prev) => [...prev, ..._photos]);
        setHasMore(_photos.length > 0);

        setIsLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [page, safesearch, newquery]);

  return { isLoading, hasMore, photos, error };
};

export default useFlickrSearch;
