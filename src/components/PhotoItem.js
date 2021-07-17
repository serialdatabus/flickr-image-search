import React, { forwardRef } from "react";
import LazyImage from "./LazyImage";
const PhotoItem = (props, ref) => {
 
  const { onTagSearch } = props;
  const { url_m, url_o, title, description, tags, id, owner, ownername  } =
    props.itemData;

  const photoUrl = `https://www.flickr.com/photos/${owner}/${id}`;
  const authorPageUrl = `https://www.flickr.com/photos/${owner}/`;
  return (
    <div className="flickr-photo-item" ref={ref}>

      {/*
      For some strange reason the flickr ap sometimes don't return the medium images ( the "url_m" field )  
      To avoid that, if the "url_m" field is not returned whe use the "url_o" field instead
      */}
      <LazyImage alt="" src={url_m ? url_m : url_o} />

      <div className={"info"}>
        <a target="_blank" rel="noreferrer" href={photoUrl}>
          {title ? title : "( No title )"}
        </a>{" "}
        <span>by</span>{" "}
        <a target="_blank" rel="noreferrer" href={authorPageUrl}>
          {ownername}
        </a>
      </div>

      <div className="description" >
      <p className="description-label">Description: </p>
  
        <p dangerouslySetInnerHTML={{__html: description._content}}>

        </p>

      </div> 

      <div className="tags">
        <span className="label">Tags:</span>
        <span className="tags-list">
          {tags.split(" ").map((tag, index) => (
            <a key={tag} onClick={(e)=>{ e.preventDefault(); onTagSearch(tag); }} href="/">
              {tag}
            </a>
          ))}
        </span>
      </div>
    </div>
  );
};

export default forwardRef(PhotoItem);