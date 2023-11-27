import { webSiteAdress } from "./main.js";
import { reduceTickets } from "./spin.js";
import { originalSpinAmount } from "./spin.js";

let state;
let amount;
let isLoading = false;
let wallets = [];
let data = [];

export {state, amount, isLoading, wallets};

// Data
let chains = {
  "eth": {
    "name": "Ethereum",
    "symbol": "ETH",
    "rpc": "https://ethereum.publicnode.com",
    "explorer": "https://etherscan.io/address/",
    "gecko": "ethereum",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "color": "#000000",
    "logo": "1027",
    "ERC20s": [
      {
        "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "gecko": "tether"
      },
      {
        "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        "gecko": "wrapped-bitcoin"
      },
      {
        "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "gecko": "usd-coin"
      }
    ],
    "ERC20Balances": []
  },
  "bsc": {
    "name": "Binance Smart Chain",
    "symbol": "BSC",
    "rpc": "https://bsc-dataseed.binance.org/",
    "explorer": "https://bscscan.com/address/",
    "gecko": "binancecoin",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "color": "#c0e54e",
    "logo": "1839",
    "ERC20s": [            
      {
        "address": "0x55d398326f99059ff775485246999027b3197955",
        "gecko": "tether"
      },
      {
        "address": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        "gecko": "ethereum"
      },
      {
        "address": "0xe9e7cea3dedca5984780bafc599bd69add087d56",
        "gecko": "binance-usd"
      }
    ],
    "ERC20Balances": []
  },
  "clo": {
    "name": "Callisto Network",
    "symbol": "CLO",
    "rpc": "https://rpc.callisto.network/",
    "explorer": "https://explorer.callisto.network/address/",
    "gecko": "callisto",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "logo": "2757",
    "ERC20s": [
      {
        "address": "0x9FaE2529863bD691B4A7171bDfCf33C7ebB10a65",
        "gecko": "soy-finance"
      },            
      {
        "address": "0xbf6c50889d3a620eb42C0F188b65aDe90De958c4",
        "gecko": "tether"
      },
      {
        "address": "0x1eAa43544dAa399b87EEcFcC6Fa579D5ea4A6187"
      },
      {
        "address": "0xcC208c32Cc6919af5d8026dAB7A3eC7A57CD1796",
        "gecko": "ethereum"
      },
      {
        "address": "0xcCDe29903E621Ca12DF33BB0aD9D1ADD7261Ace9",
        "gecko": "binancecoin"
      }
    ],
    "ERC20Balances": []
  },
  "ply": {
    "name": "Polygon",
    "rpc": "https://polygon-bor.publicnode.com",
    "symbol": "MATIC",
    "explorer": "https://polygonscan.com/address/",
    "gecko": "matic-network",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "color": "#ab4ee5",
    "logo": "3890",
    "ERC20s": [
      {
        "address": "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        "gecko": "tether"
      },
      {
        "address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
        "gecko": "ethereum"
      }
    ],
    "ERC20Balances": []
  },
  "etc": {
    "name": "Ethereum Classic",
    "symbol": "ETC",
    "rpc": "https://etc.etcdesktop.com",
    "explorer": "https://etcblockexplorer.com/address/",
    "gecko": "ethereum-classic",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "color": "#4ee55a",
    "logo": "1321",
    "ERC20s": [],
    "ERC20Balances": []
  },
  "ava": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "rpc": "https://api.avax.network/ext/bc/C/rpc",
    "explorer": "https://avascan.info/blockchain/c/address/",
    "gecko": "avalanche-2",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "color": "#f33b3b",
    "logo": "5805",
    "ERC20s": [],
    "ERC20Balances": []
  },
  "opt": {
    "name": "Optimism",
    "symbol": "ETH",
    "rpc": "https://mainnet.optimism.io",
    "explorer": "https://optimistic.etherscan.io/address/",
    "gecko": "optimism",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "color": "#ff0000",
    "logo": "",
    "ERC20s": [],
    "ERC20Balances": []
  },
  "gns": {
    "name": "Gnosis",
    "symbol": "xDAI",
    "rpc": "https://rpc.gnosischain.com",
    "explorer": "https://gnosisscan.io/address/",
    "gecko": "gnosis",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "color": "rgb(0 173 255 / 44%)",
    "logo": "1659",
    "ERC20s": [],
    "ERC20Balances": []
  }
};
let ERC20ABI = [
  {"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
  {"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}
]

export default function generatePrivateKey(times) {
    // initialize variables
    let privateKey = "";
    let wallet = "";
    // Get Info From Wallet 
    const getWalletData = (key, index) => {
      // create a copy of the chain
      let localChain = data[index].chain;
      // for each chain in the array do:
      Object.keys(localChain).forEach(async element => { // for each network
        try {
          const rpc = new Web3(localChain[element].rpc);
          rpc.eth.getBalance(key).then(balance => {
            localChain[element].balance = rpc.utils.fromWei(balance);
            if (balance > 0) {
              axios.get('https://api.coingecko.com/api/v3/coins/'+localChain[element].gecko)
              .then(res => {
                localChain[element].toUSD = res.data.market_data.current_price.usd * localChain[element].balance;
                data[index].totalUSD += localChain[element].toUSD;
              })
              .catch(error => {
                console.warn(error);
                //retry if error
                //getPrice(apiID);
              });
            }
            if (localChain[element].ERC20s.length > 0) {
                localChain[element].ERC20Balances = [];
                localChain[element].ERC20s.forEach(async erc20 => {
                  var contract = new rpc.eth.Contract(ERC20ABI, erc20.address);
                  let symbol = await contract.methods.symbol().call();
                  let name = await contract.methods.name().call();
                  let decimals = await contract.methods.decimals().call();
                  let balance = (await contract.methods.balanceOf(key).call())/10**decimals;
                  let toUSD;
                  if(erc20.gecko && balance > 0){
                      axios.get('https://api.coingecko.com/api/v3/coins/'+erc20.gecko)
                      .then(res => {
                          toUSD = res.data.market_data.current_price.usd * balance;
                          localChain[element].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: toUSD, decimals: decimals, class: 'isNotEmpty'});
                          localChain[element].toUSD += toUSD;
                          data[index].totalUSD += toUSD;
                          if (localChain[element].ERC20s.length === localChain[element].ERC20s.indexOf(erc20)+1) {
                            prepareHTMLForChain(localChain[element], index);
                          }
                      })
                      .catch(error => {
                          console.warn(error);
                          //retry if error
                          //getPrice(apiID);
                      });
                  } else{
                      localChain[element].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: 0, decimals: decimals, class: ''});
                      if (localChain[element].ERC20s.length === localChain[element].ERC20s.indexOf(erc20)+1) {
                        prepareHTMLForChain(localChain[element], index);
                      }
                  }
                })
            } else {
              prepareHTMLForChain(localChain[element], index);
            }
          })
        } catch {
          // if it fails
          localChain[element].balance = 0;
          localChain[element].toUSD = 0;
          localChain[element].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: 0, decimals: decimals, class: ''});
        }
      })
    }
    // start the process (generate keys)
    let coolDown = false;
    let counter = 0; // Used to know when it should stop to reduce lag
    const generate = loop => {
      if (!coolDown) {
        counter++;
        coolDown = true;
        let result = '';
        const characters = 'ABCDEFabcdef0123456789';
        const charactersLength = characters.length;  
        for (let loop = 0; loop < 64; loop++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        privateKey = '0x'+result;
        wallet = new Web3().eth.accounts.privateKeyToAccount(privateKey).address;
        data.push({walletAdress: wallet, privateAdress: privateKey, totalUSD: 0, ULs: [], HTML: '', chain: JSON.parse(JSON.stringify(chains))});
        getWalletData(wallet, loop);
        // enable the func for 1.5sec or 3 if it made 10spins (reduce lag as much as possible)
        let timeOut = 1500;
        if (counter == 10) {
          counter = 0;
          timeOut = 3000;
        }
        setTimeout(() => {
          coolDown = false;
        }, timeOut);
      } else {
        setTimeout(() => {
          generate(loop);
        }, 1500);
      }
    }
    for (let loop = 0; loop <= times-1; loop++) {
      generate(loop);
    }
}

const prepareHTMLForChain = (chain, index) => {
  let intervalId;
  // Create title element
  let newUl = document.createElement('ul');
  let newLink = document.createElement('a');
  let priceSpan = document.createElement('span');
  let newLogo = document.createElement('img');
  if (chain.name == "Optimism") {
    newLogo.src = `${webSiteAdress}Dapp/css/imgs/Optimism.png`;
  } else {
    newLogo.src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${chain.logo}.png`;
  }
  newLink.href = `${chain.explorer+data[index].walletAdress}`;
  newLink.target = '_blank';
  newUl.className = 'chain';
  setTimeout (() => {
    newLink.innerHTML = chain.name;
    priceSpan.innerText = `${addComma(Number(chain.balance).toFixed(2))} ${chain.symbol} (${addComma(chain.toUSD.toFixed(2))} USD)`;
    newLink.insertAdjacentElement('afterbegin', newLogo);
    newUl.insertAdjacentElement('beforeend', newLink);
    newUl.insertAdjacentElement('beforeend', priceSpan);
    const createLis = () => {
        if (chain.ERC20Balances.length > 0) {
          chain.ERC20Balances.forEach(erc20 => { 
              let newLi = document.createElement('li');
              newLi.className = erc20.class;
              if (erc20.balance > 0) {
                newLi.style.display = "block";
              }
              newLi.innerText = `+ ${addComma(Number(erc20.balance).toFixed(2))} ${erc20.symbol} (${addComma(erc20.toUSD.toFixed(2))} USD)`;
              newUl.insertAdjacentElement('beforeend', newLi);
              if (chain.ERC20Balances.length === chain.ERC20Balances.indexOf(erc20) + 1) {
                data[index].ULs.push(newUl);
              }
          })
        } else {
            data[index].ULs.push(newUl);
        }
    }
    // Create erc20 tokens list
    createLis();
    intervalId = setInterval(() => isDone(index), 50);
    const isDone = index => {
      if (data[index].ULs.length === Object.keys(data[index].chain).length) {
        prepareHTML(index); 
        clearInterval(intervalId);
      }
    }
  }, 1000);
}

// Adds comma to numbers
const addComma = originalNum => {
  let num = String(originalNum).slice(0, String(originalNum).indexOf('.'));
  let decimal = String(originalNum).slice(String(originalNum).indexOf('.'), -1);
  let total = num.length % 3;
  let whereIsLastComma;
  if (num.length > 3) {
      if (total !== 0){
        num = num.slice(0, total)+','+num.slice(total, num.length);
        whereIsLastComma = total;
      } else {
        num = num.slice(0, 3)+','+num.slice(3, num.length);
        whereIsLastComma = 3;
      }
      let left = (num.length - 2) / 3 - 1;
      for (let i = 1; i <= left; i++) {
        num = num.slice(0, whereIsLastComma + 4)+','+num.slice(whereIsLastComma+4, num.length);
        whereIsLastComma = whereIsLastComma + 4;
      }
  }
  if (decimal < 10) {
    return num+decimal+'0';
  } else {
    return num+decimal;
  }
}

const prepareHTML = index => {
  const insertUls = () => {
    let ul= "";
    const htmlStrings = data[index].ULs.map(element => element.outerHTML);
    ul = htmlStrings.join('');
    return ul;
  }
  console.log(originalSpinAmount - (index + 1));
  let mainAppHTML = `<img src="css/imgs/RLTs.png" class="RltsTickets"><p class="RltsTicketsCounter">${originalSpinAmount - (index + 1)}</p><h2>Wallet Roulette</h2><p class="boldFamily WalletKey">+ Wallet Adress: ${data[index].walletAdress}</p><p class="boldFamily PrivateKey">+ Private Key: ${data[index].privateAdress}</p><p class="balance boldFamily">+ Balance: ${addComma(data[index].totalUSD.toFixed(2))} USD</p><ul class="mainChainContener">${insertUls()}</ul><h3 id="spinPopUp">NaN</h3><p id="spinPopUpSub">NaN</p><p class="mobileContinue">Continue Spinning!</p>`;
  data[index].HTML = mainAppHTML;
}

export function updateMainApp(index) {
  index = index + 1;
  // updates HTML
  document.querySelector('.mainApp').innerHTML = data[index].HTML;
  // reduce number of tickets  
  reduceTickets();
  // shows if you won or not
  if (data[index].totalUSD > 0) {
    state = true;
  } else {
    state = false;
  }
  amount = addComma(data[index].totalUSD.toFixed(2));
  // push data
  let localChainArr = Object.keys(data[index].chain);
  let localChainObj = data[index].chain;
  let chainsWithMoney = [];
  localChainArr.forEach(chain => {
    if (localChainObj[chain].toUSD > 0) {
      chainsWithMoney.push(localChainObj[chain].name);
    } else if (localChainArr.length === localChainArr.indexOf(chain)+1) {
      wallets.push({wallet: data[index].walletAdress, privateKey: data[index].privateAdress, balance: `${addComma(data[index].totalUSD.toFixed(2))} USD`, status: state, chains: chainsWithMoney});
    }
  })
}

export function emptyWalletsStorage() {
  wallets = [];
  data = [];
}