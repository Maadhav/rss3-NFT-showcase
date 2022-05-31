import { useState, useEffect } from "react";
import "./App.css";
import NftCard from "./components/NftCard";
import { getNfts } from "./helpers";
import useAsyncEffect from "use-async-effect";
import InfiniteScroll from "react-infinite-scroll-component";
import { EditText } from "react-edit-text";
import "react-edit-text/dist/index.css";

const axios = require("axios").default;
const PageLimit = 50;

function App() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moreExists, setMoreExists] = useState(true);
  const [address, setAddress] = useState(
    "0x9a6F28A46e0BA4F5c94DC260620a5a26F42aDeCA"
  );

  useAsyncEffect(async () => {
    loadNfts();
  }, []);

  const loadNfts = async (isNew = false) => {
    if (isNew) setLoading(true);
    const res = await axios.get(
      `https://pregod.rss3.dev/v0.4.0/account:${address}@ethereum/notes`,
      {
        params: {
          last_identifier: isNew
            ? null
            : nfts.length > 0
            ? nfts[nfts.length - 1].identifier
            : null,
          tags: "NFT",
          limit: 4,
        },
      }
    );
    isNew
      ? setNfts(res.data.list)
      : setNfts((nfts) => {
          return nfts.concat(res.data.list);
        });
    setMoreExists(res.data.identifier_next);
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="colorful-highlight">RSS3 NFT ART GALLERY</p>
        <EditText
          className="domain-name"
          inputClassName="domain-name"
          value={address}
          onChange={(e) => setAddress(e)}
          onSave={(e) => {
            loadNfts({ isNew: true });
          }}
        />
        <br />
        <br />
        {loading ? (
          <div className={"loader-container margin-bottom"}>
            <div className="loader"></div>
          </div>
        ) : (
          <InfiniteScroll
            hasMore={moreExists}
            next={loadNfts}
            dataLength={nfts.length}
            loader={
              <div className={"loader-container"}>
                <div className="loader"></div>
              </div>
            }
            scrollThreshold={0.7}
          >
            {nfts.map((nft, index) => (
              <NftCard nft={nft} key={index} />
            ))}
          </InfiniteScroll>
        )}
        {!loading && !nfts.length ? (
          <div className="black margin-bottom">
            No NFTs found in this wallet
          </div>
        ) : null}
        <div className={`powered-by-container`}>
          <div className={"powered-by-text"}>
            Powered by{" "}
            <span className={"blue-link-highlight"} onClick={() => {}}>
              <img
                src="https://rss3.mypinata.cloud/ipfs/QmUG6H3Z7D5P511shn7sB4CPmpjH5uZWu4m5mWX7U3Gqbu"
                alt="RSS3"
                height={15}
              />
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
