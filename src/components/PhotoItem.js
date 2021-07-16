import React, { forwardRef } from "react";
import LazyImage from "./LazyImage";
const PhotoItem = (props, ref) => {
 
  const { onTagSearch } = props;
  const { url_m, title, description, tags, id, owner, ownername  } =
    props.photodata;

  const link_photo = `https://www.flickr.com/photos/${owner}/${id}`;
  const author_page = `https://www.flickr.com/photos/${owner}/`;
  return (
    <div className="flickr-photo-item" ref={ref}>
      <LazyImage alt="" src={url_m} />

      <div className="info">
        <a target="_blank" rel="noreferrer" href={link_photo}>
          {title ? title : "( No title )"}
        </a>{" "}
        <span>by</span>{" "}
        <a target="_blank" rel="noreferrer" href={author_page}>
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