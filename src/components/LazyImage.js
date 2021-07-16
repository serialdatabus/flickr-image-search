import React, { useState } from "react";
import LazyLoad from "react-lazyload";
const LazyImage = ({ src, alt }) => {
  const refPlaceHolder = React.useRef();

  const [loaded, setLoaded] = useState(false);

  const removePlaceHolder = () => {
    refPlaceHolder.current.remove();
    setLoaded(true);
  };

  return (
    <>
      <div  ref={refPlaceHolder} className="placeholder"></div>

      <LazyLoad className={loaded ? "" : "notloaded"}>
        <img
          alt={alt}
          onLoad={removePlaceHolder}
          onError={removePlaceHolder}
          className="photo"
          src={src ? src : ""}
        />
      </LazyLoad>
    </>
  );
};

export default LazyImage;
