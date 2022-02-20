import React, { useRef, useState, useEffect } from "react";
import "./main.css";
import discord from "./media/discord.png";
import twitter from "./media/twitter.png";
import telegram from "./media/telegram.png";
import cac from "./media/cac.png";
import desert from "./media/desert.png";
import Web3 from "web3";
import contractjson from "./details/contract.json";

let contract = null;
let selectedAccount = null;
const ADDRESS = "0xAb444C2cB2Ca6635f317b37440A7C0DA056B6971";

const loadedData = JSON.stringify(contractjson);
const abi = JSON.parse(loadedData);

export default function Main() {
  const inputMint = useRef();
  const [mintCount, setMintCount] = useState(0);
  const [textInput1, setTextInput1] = useState(1);
  const [selected, setSelected] = useState(null);
  // const [totalCount, setTotalCount] = useState(7800);
  const totalCount = 7800;

  useEffect(() => {
    const interval = setInterval(() => {
      let provider = window.ethereum;
      if (typeof provider !== "undefined") {
        const web3 = new Web3(provider);
        contract = new web3.eth.Contract(abi, ADDRESS);
        contract.methods
          .mintedAlready()
          .call()
          .then((cts) => {
            console.log(cts);
            setMintCount(cts);
          });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function checkNetwork() {
      let provider = window.ethereum;
      const web3 = new Web3(provider);
      let accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        selectedAccount = accounts[0];
        setSelected(selectedAccount.slice(0, 5) + "..." + selectedAccount.slice(-4));
      }
      if (typeof provider !== "undefined") {
        const web3 = new Web3(provider);
        contract = new web3.eth.Contract(abi, ADDRESS);
        contract.methods
          .mintedAlready()
          .call()
          .then((cts) => {
            console.log(cts);
            setMintCount(cts);
          });
      }
    }
    checkNetwork();
  }, []);

  const changeValue = (newValue) => {
    let value = newValue != 21 ? newValue : 20;
    setTextInput1(value);
  }

  const setMintValue = (val, field) => {
    val = parseInt(val, 10);
    if (!val) {
      if (field) {
        val = ''
      } else {
        val = 1
      }
    }
    if (val < 0) {
      val = 1
    }
    if (!field) {      
      inputMint.current.style.transform = val > mintCount ? 'translateY(-100%)' : 'translateY(100%)'
      inputMint.current.style.opacity = 0
       
      setTimeout(() => {
        inputMint.current.style.transitionDuration = '0s'
        inputMint.current.style.transform = val > mintCount ? 'translateY(100%)' : 'translateY(-100%)'
        inputMint.current.style.opacity = 0
        changeValue(val);
        
        setTimeout(() => {
          inputMint.current.style.transitionDuration = '0.3s'
          inputMint.current.style.transform = 'translateY(0)'
          inputMint.current.style.opacity = 1
        }, 20)
      }, 250)
    } else {
      changeValue(val);
    }    
    // changeMintValue();
  }

  async function onConnectClick() {
    let provider = window.ethereum;
    const chainId = await provider.request({ method: 'eth_chainId' });
    if(chainId == 0xa516) {
      if (typeof provider !== "undefined") {
        provider
          .request({ method: "eth_requestAccounts" })
          .then((accounts) => {
            selectedAccount = accounts[0];
            setSelected(selectedAccount.slice(0, 5) + "..." + selectedAccount.slice(-4));
            console.log("Selected Account is " + selectedAccount);
          })
          .catch((err) => {
            console.log(err);
          });

        provider.on("chainChanged", function () {
          window.location.reload();
        });

        provider.on("accountsChanged", function (accounts) {
          if (accounts.length > 0) {
            selectedAccount = accounts[0];
            console.log("Selected Account change is" + selectedAccount);
          } else {
             window.location.reload();
            console.error("No account is found");
          }
        });

        provider.on("message", function (message) {
          console.log(message);
        });

        provider.on("connect", function (info) {
          console.log("Connected to network " + info);
        });

        provider.on("disconnect", function (error) {
          console.log("Disconnected from network " + error);
          window.location.reload();
        });
      } else {
        alert("Please install metamask");
      }
    }
    else {
      alert("Please change your chain account to Oasis");
    }
    // console.log(chainId);
    
  }

  async function onPublicMintClick() {
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
        .safeMint(textInput1)
        .send({ from: accounts[0], value: cost });
      setTextInput1(1);
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
      setTextInput1(1);
    }
  }
  return (
    <div className="container">
      <div className="header">
        <div className="socialLink">
          <a href="http://t.me/miragemkt" target="_blank">
            <img className="socialIcon" src={telegram} />
          </a>
          <a href="https://discord.gg/bUBycbtuCh" target="_blank">
            <img className="discord" src={discord } />
          </a>
          <a href="https://twitter.com/MirageMarket" target="_blank">
            <img className="socialIcon" src={twitter} />
          </a>
        </div>
        <div className="logo">
        <span>mirage</span>
        </div>
        <div className="connectWallet">
          {selected !== null ? <button className="fontStyle">Connected {selected}</button> : 
            <button className="fontStyle" onClick={onConnectClick}>Connect to Wallet</button>
          }
        </div>
      </div>
      <div className="content">
        <div className="boxModal">
          <div className="boxModalTitle">
            <p className="cactusClaim">CLAIM YOUR</p>
            <img src={cac} className="cactusTitle" />
          </div>
          <div className="mintCount">
            <span 
              className="minus" 
              onClick = {() => setMintValue(textInput1 + 1)}
            >
              +
            </span>
            <div className="input-wrapper">
              <input 
                className="mintValue" 
                ref={inputMint} 
                type="text" 
                value={textInput1}
                maxLength="2"
                onChange={(e) => setMintValue(e.target.value, true)}
              />
            </div>
            <span 
              className="plus"
              onClick = {() => setMintValue(textInput1 - 1)}
            >
              -
            </span>
          </div>
          <div className="mintTotalCount">
            <div className="circle"></div>
            <div className="total">
              <span>Cactus Mint: </span>
              <span>{mintCount}/{totalCount}</span>
            </div>
            <div className="circle"></div>
          </div>
          <div className="mintButtons">
            <button className="wlButton" onClick={onWhitelistMintClick}>WHITELIST MINT</button>
            <button className="plButton" onClick={onPublicMintClick}>PUBLIC MINT</button>
          </div>
          <img className="desert" src={desert} />
        </div>
        <div>
          <div className="sun"></div>
          <img className = "cactus" src = "https://www.freeiconspng.com/uploads/cactus-transparent-clipart-png-18.png" />
          <div className = "sand first"><div className = "sand-inner"></div></div>
          <div className = "sand"><div className = "sand-inner"></div></div>
          <img className="bush" src="https://lh5.ggpht.com/SmI3FDZzhzV2uj9Of1MlbcdW5phOie9bzQ5TZ-YxfstqVwoeoxOku67F2n4kvdsX9U_y9Nb8D4JLcW1QJI_9EpM=s400" />
        </div>
      </div>      
    </div>
  );
}
