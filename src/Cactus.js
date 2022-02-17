import React, { useRef, useState, useEffect } from "react";
import "./style.css";
import cactus_mid from "./media/cactus-mid.png";
import sun_set from "./media/sun-set.png";
import cactus from "./media/catus.gif";
import Web3 from "web3";
import contractjson from "./details/contract.json";
// import { connectWallet } from "./utils/interact.js";

let contract = null;
let selectedAccount = null;
const ADDRESS = "0x0e1Bc1433c5F546F4c7c489d0e9764a2aeBa16bb";

const loadedData = JSON.stringify(contractjson);
const abi = JSON.parse(loadedData);

export default function Cactus() {
  const sliderangle = useRef();
  const [textInput1, setTextInput1] = useState(0);
  const [mintCount, setMintCount] = useState(0);
  const [totalCount, setTotalCount] = useState(7780);
  useEffect(() => {
    // const interval = setInterval(() => {
    //   let provider = window.ethereum;
    //   if (typeof provider !== "undefined") {
    //     const web3 = new Web3(provider);
    //     contract = new web3.eth.Contract(abi, ADDRESS);
    //     contract.methods
    //       .mintedAlready()
    //       .call()
    //       .then((cts) => {
    //         console.log(cts);
    //         setMintCount(cts);
    //       });
    //   }
    // }, 5000);
    // return () => clearInterval(interval);
  }, []);
  function rangeSlide(event) {
    const value = Number(event.target.value) / 100;
    event.target.style.setProperty("--thumb-rotate", `${value * 2880}deg`);
    const slider_value = Math.round(event.target.value);
    setTextInput1(slider_value);
    setMintCount(slider_value);
  }
  async function onConnectClick() {
    let provider = window.ethereum;
    if (typeof provider !== "undefined") {
      provider
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          selectedAccount = accounts[0];
          console.log("Selected Account is " + selectedAccount);
        })
        .catch((err) => {
          console.log(err);
        });

      window.ethereum.on("chainChanged", function () {
        window.location.reload();
      });

      window.ethereum.on("accountsChanged", function (accounts) {
        if (accounts.length > 0) {
          selectedAccount = accounts[0];
          console.log("Selected Account change is" + selectedAccount);
        } else {
          console.error("No account is found");
        }
      });

      window.ethereum.on("message", function (message) {
        console.log(message);
      });

      window.ethereum.on("connect", function (info) {
        console.log("Connected to network " + info);
      });

      window.ethereum.on("disconnect", function (error) {
        console.log("Disconnected from network " + error);
      });
    } else {
      alert("Please install metamask");
    }
  }

  async function onPublicMintClick() {
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] == null) {
      alert("Plese connect  metamask");
    } else {
      contract = new web3.eth.Contract(abi, ADDRESS);
      const cost = 200000000000000000 * textInput1;
      alert(cost);
      contract.methods
        .safeMint(textInput1)
        .send({ from: accounts[0], value: cost });
      setTextInput1(0);
      sliderangle.current.style.setProperty("--thumb-rotate", `${0 * 720}deg`);
    }
  }
  async function onWhitelistMintClick() {
    let provider = window.ethereum;
    const web3 = new Web3(provider);
    let accounts = await web3.eth.getAccounts();
    if (accounts[0] == null) {
      alert("Plese connect  metamask");
    } else {
      contract = new web3.eth.Contract(abi, ADDRESS);
      const cost = 100000000000000000 * textInput1;
      alert(cost);
      contract.methods
        .mintForWhiteListed(textInput1)
        .send({ from: accounts[0], value: cost });
      setTextInput1(0);
      sliderangle.current.style.setProperty("--thumb-rotate", `${0 * 720}deg`);
    }
  }
  return (
    <div className="container">
      <div className="content">
        <div className="topContent">
          <button className="connectWallet" onClick={onConnectClick}>
            Connect Wallet
          </button>
          <div className="sunSetImg">
            <img src={sun_set} alt="sun-set" />
          </div>
        </div>
        <div className="bottomContent">
          <div className="gifDiv">
            <img src={cactus} alt="cactus-gif" className="cactus-gif" />
          </div>
          <div className="imgDiv">
            <div>
              <img src={cactus_mid} alt="cactus" className="cactusMid" />
            </div>
            <div className="slight-right-div">
              <img src={cactus_mid} alt="cactus" className="cactusSmall" />
            </div>
            <div className="slight-right-margin-down-div">
              <img src={cactus_mid} alt="cactus" className="cactusLarge" />
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <div className="sliderValue">
          <div className="mintCount">
            {mintCount}/{totalCount}
          </div>
          <div className="pad">
            <input
              id="slider"
              name="slider"
              type="range"
              value={textInput1}
              min="0"
              max="20"
              onChange={rangeSlide}
              step="1"
              ref={sliderangle}
            />
            <label htmlFor="slider">{textInput1}</label>
          </div>
        </div>
        <div className="mintButtons">
          <button 
            className="font-style whiteListMint"
            onClick={onWhitelistMintClick}
          >
            WHITELIST MINT
          </button>
          <button 
            className="font-style publicMint"
            onClick={onPublicMintClick}
          >
            PUBLIC MINT
          </button>
        </div>
      </div>
    </div>
  );
}
