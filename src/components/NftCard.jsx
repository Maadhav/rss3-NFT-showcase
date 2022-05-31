import { useEffect, useState, useRef } from "react";
import "./NftCard.css";
import VisibilitySensor from "react-visibility-sensor";
import axios from "axios";
import { Image, Shimmer } from "react-shimmer";
import useAsyncEffect from "use-async-effect";

const NftCard = ({ nft }) => {
  const MaxTextLength = 100;
  const [openDescription, setOpenDescription] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAn1BMVEX///8AAABlZWXAwMDX19fh4eHU1NQvLy+4uLjb29tonf8Ab/8AbP+iwf9cXFxvb2/Kysrx8fF7e3v5+fmnp6c+Pj6GhoYODg6ysrKsrKzm5uY2NjZNTU2UlJQYGBhqampGRkYlJSWPj4+cnJweHh51dXWHh4dYWFiSkpJMTEzGxsZxov9emP/Q3//l7v8Yd/8AZv++0//b6P8AYP+dvv9+cI5TAAAEZUlEQVR4nO3Z23baOBSAYSuADXMAfCCAEwKEUJq0nXamff9nG51sS7JZbVkEuPi/K2PZRhvZ2lsmigAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApxn1XG+j1gGD5YcsW/XSVkNcyIbdWx7s7q/GSTKbFOU7dfi3PYvA3oslTqr9j9MoF2JYNSzqE+5G0VSI2OwePdT7DzcS4yqMUIhe0/rR3X9Imwjv3IYsriIsjl3oiorN44sQ68xYP6mexVXjTn16eC6K+2oobYQ6wNdVUWRPtkGfowJ8WQ7yKI2fvQtd2VqI5vGbzoWY2+1SdnLbN9uDiRPhm7pr7U0YP9YRyjEW9/WVxvLTBXr/K+SA9JtP8mETC7OZCZE0Df0mwlchxk1Drx6uNMmc686cx/a6/AijoRwfsyXcwZWxJ7bL6kdwp9Cy+4aU88/k7J09SRBhVN1deXO/GqWNMPaGMIqcudQjn+Fz9vN0YYRy8tAZI/VuUrOjinDvNcTHInw5a0dP1jGGabXh5fNqDAdCPHlX6B5DedjsvD09VRBhXs+Bs2Cs8t3OPJfyiMJtKHe7jvS+d2fWqwoilEltY7aGIrwdLVUmrH522WUwUV1RO1tUA7RReeB50D5FJk0x37Vr1cZIFQU3MpWqCJsgyq2bqGc6mz/dvwWnpHPdkDxP25ebPMxmpgQ6vFOHf8mnP5TPX9S2jHA8Mda6cHbi2dX1dVBk3lcN+zDIQ9Vis2r02XzXP+8XTZevfyrf/lXbXhXdKpiLenXhTS5Ruprb/U9+5bKpL/Ripp9v5rv+e8942r7+pXzviHDSerrK3cyGEjyR/Y9b07BxzxmMpLjQ5+j93813XTjCv7Uf+ltlhMvpdBrLPk2OrOny4bhZQbjS5auoQ/HJJGlqmh/muy58l7ru7Kw+6u6pleq1Yriil8pMhMWPbZD7O2aiK6izxb6ZHbrIGkVkXQ1vzXLEszqSTi+ujjBvTTO+3rEV36ouEjzlrRSmTcZfeiE8BksLXa2pB3UeDk1+JPRbWQM7Nc2Dv0gPn64782AlrWLlpfMJvcUI1WRTp4Sx2AZHHsyc1I5w3hnhIFxgXotbl+6dFY9MEEv/SDvZJmHaKG0oQaEt6571uTt7EjdC5y2NfpXkhbizCS4JM+PETLI9//DBTyauy/HWFs5ko5O8M6fEVfS6jnNWT4VZJ/Xbh4e3+ZV4bxPVcsImPVPGCLu4TT/Uid1UqvPClAf1OinXFem9Ht18qmvBjoXXxQ0XQ9mx1WKpZ4p0uVCLhmKxLFWEM/NGfP64Pmyd4iwR2dqU1oexeVtqJ93M/CbzrS3Kb6Kiqf9n0J2P3QWGyhbN/xZOgZ3IlDJ0q/W76mrx1j38Nv64qCPoilDNK9O93TOul40POmn2qjXJxJ116sOzW3mlXw4s/SmvPg3c9JaO4n7neKT9eNSu1eXhHXsBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4Oz+B3ukL/LnyLAfAAAAAElFTkSuQmCC"
  );
  const [title, setTitle] = useState(nft.title);
  const [desc, setDesc] = useState(nft.summary);

  const handleClick = () => {
    window.open(nft.related_urls[nft.related_urls.length - 1], "_blank");
  };

  useAsyncEffect(async () => {
    setTimeout(async () => {
      const image = await renderImage();
      setImageUrl(image);
    }, 1000);
  }, []);

  const renderDescription = () => {
    const handleMoreClick = () => {
      setOpenDescription(true);
    };

    if (openDescription) {
      return desc;
    } else {
      return (desc ?? "").length > MaxTextLength ? (
        <>
          {(desc ?? "").substring(0, MaxTextLength) + "..."}
          <span onClick={handleMoreClick} className="more">
            more
          </span>
        </>
      ) : (
        desc
      );
    }
  };

  const renderImage = async () => {
    let openSeaLink = nft.related_urls.find((e) => e.includes("opensea.io"));
    if (openSeaLink) {
      const resp = await axios.get(
        `https://api.opensea.io/api/v1/asset/${nft.metadata.collection_address}/${nft.metadata.token_id}`
      );
      if (!nft.title) {
        setTitle(resp.data.name);
        setDesc(resp.data.description);
      }
      if (resp.data.image_preview_url) return resp.data.image_preview_url;
    }
    const image =
      nft.attachments && nft.attachments.length > 1
        ? nft.attachments.find((e) => e.type === "preview").address
        : null;
    if (image.startsWith("ipfs")) {
      return "https://infura-ipfs.io/ipfs/" + image.replace("ipfs://", "");
    }
    return image;
  };

  return (
    <div className="NFT-container">
      <div className="NFT-image-container">
        {imageUrl ? (
          <Image
            src={imageUrl}
            onClick={handleClick}
            fallback={
              <Shimmer width={250} height={250} className="NFT-image" />
            }
            alt={title}
            NativeImgProps={{ className: "NFT-image" }}
          />
        ) : (
          <Shimmer width={250} height={250} className="NFT-image" />
        )}
      </div>
      <div className="NFT-infoContainer">
        <div className="NFT-name" onClick={handleClick}>
          {title}
        </div>
        <div className="NFT-description">{renderDescription()}</div>
      </div>
    </div>
  );
};

export default NftCard;
