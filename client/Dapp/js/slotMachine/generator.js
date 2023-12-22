import { wallet } from '../connectWallets/walletsHandler.js';
import { reduceTickets } from './spin.js';
let state;
let amount;
let isLoading = false;
let wallets = [];
let results = [];
let serverAddress = "http://localhost:8080";
let username = "walletRoulette";
let password = "$2b$10$z3PMPBJDruKDjkdbqba2luSzR2YqFgpMzNc8lFADQCi2H5Nn7tyHi";

export {state, amount, isLoading, results, wallets};

// Data
let chains = {
  "eth": {
    "name": "Ethereum",
    "symbol": "ETH",
    "explorer": "https://etherscan.io/address/",
    "gecko": "ethereum",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
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
    "explorer": "https://bscscan.com/address/",
    "gecko": "binancecoin",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
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
    "symbol": "MATIC",
    "explorer": "https://polygonscan.com/address/",
    "gecko": "matic-network",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
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
    "explorer": "https://etcblockexplorer.com/address/",
    "gecko": "ethereum-classic",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "logo": "1321",
    "ERC20s": [],
    "ERC20Balances": []
  },
  "ava": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "explorer": "https://avascan.info/blockchain/c/address/",
    "gecko": "avalanche-2",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "logo": "5805",
    "ERC20s": [],
    "ERC20Balances": []
  },
  "opt": {
    "name": "Optimism",
    "symbol": "ETH",
    "explorer": "https://optimistic.etherscan.io/address/",
    "gecko": "optimism",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
    "logo": "",
    "ERC20s": [],
    "ERC20Balances": []
  },
  "gns": {
    "name": "Gnosis",
    "symbol": "xDAI",
    "explorer": "https://gnosisscan.io/address/",
    "gecko": "gnosis",
    "balance": 0,
    "toUSD": 0,
    "nonce": 0,
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

export async function generate(originalSpinAmount) {
  let data = [];
  const loop = originalSpinAmount / 10;
  let keyCount = 0;
  let generatedKeys = 0;
  let token;
  // login
  const requestLogin = async () => {
    try {
      const response = await axios.post(`${serverAddress}/login`, {
        username,
        password,
        wallet
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '0xa7B49aDD3823E9c3AAbd0088162CA085e38D38cBDc6EBc28200b8d488189dEE8fc691F633E93Bd3CeFdE5A0a4C38C7e33EEd9fa67ABed607a08306aBb3FD52Da864cECeAB5a7FF2ed',
        },
      });
      token = response.data.accessToken;
    } catch (err) {
      console.log(`Error while fetching data from login endpoint: ${err.message}`)
    }
  }
  // Request keys
  const requestPrivateKey = async token => {
    try {
      const response = await axios.post(`${serverAddress}/process`, { wallet }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });
      data.push(response.data);
      generatedKeys += 10;
      // if its the first time requesting make an interval for process wallet
      if (response.data.count === 1) {
        processWallet(keyCount);
        let intervalId = setInterval(() => {
          if (keyCount !== loop*10-1 && generatedKeys > keyCount+1) {
            console.log(generatedKeys, keyCount+1)
            keyCount++;
            processWallet(keyCount);
          } else if (keyCount === loop*10-1) {
            clearInterval(intervalId);
          } else {
            console.log("Queue is full retrying...")
          }
        }, 2000);
      }
      // then request again after 1.5secs
      if (response.data.count !== loop) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        await requestPrivateKey(token);
      }
    } catch (err) {
      console.error('Error making process request:', err.message);
    }
  }
  const getRpcPath = (name, key, pack) => {
    switch (name) {
      case 'Optimism':
        return new Web3(data[pack].RPCs[key].Optimism);
      break;
      case 'Gnosis':
        return new Web3(data[pack].RPCs[key].Gnosis);
      break;
      case 'Avalanche':
        return new Web3(data[pack].RPCs[key].Avalanche);
      break;
      case 'Ethereum':
        return new Web3(data[pack].RPCs[key].Ethereum);
      break;
      case 'Binance Smart Chain':
        return new Web3(data[pack].RPCs[key].BinanceSmartChain);
      break;
      case 'Callisto Network':
        return new Web3(data[pack].RPCs[key].CallistoNetwork);
      break;
      case 'Ethereum Classic':
        return new Web3(data[pack].RPCs[key].EthereumClassic);
      break;
      case 'Polygon':
        return new Web3(data[pack].RPCs[key].Polygon);
      break;
      default:
        console.warn(name);
      break;
    }
  }
  const processWallet = (key) => {
    let pack = 0;
    if (key < 10) {
      pack = 0;
    } else if (key == 10) {
      pack = 1;
    } else if (key == 20) {
      pack = 2;
    } else if (key == 30) {
      pack = 3;
    } else if (key == 40) {
      pack = 4;
    } else if (key == 50) {
      pack = 5;
    } else if (key == 60) {
      pack = 6;
    } else if (key == 70) {
      pack = 7;
    } else if (key == 80) {
      pack = 8;
    } else if (key == 90) {
      pack = 9;
    } else {
      pack = parseInt((key-1) / 10);
    }
    const privateKeycount = key % 10;
    console.log(pack, privateKeycount)
    const generatedPrivateKeyCount = key;
    let privateKey = data[pack].PrivateKeys[privateKeycount];
    let wallet = new Web3().eth.accounts.privateKeyToAccount(privateKey).address;
    wallets.push({walletAdress: wallet, privateAdress: privateKey, totalUSD: 0, ULs: [], HTML: '', ready: false, chain: JSON.parse(JSON.stringify(chains))});
    let totalUSD = wallets[generatedPrivateKeyCount].totalUSD;
    let chain = wallets[generatedPrivateKeyCount].chain;
    Object.keys(chain).forEach(async network => {
      let rpc = getRpcPath(chain[network].name, privateKeycount, pack);
      rpc.eth.getBalance(wallet)
      .then(balance => {
        chain[network].balance = rpc.utils.fromWei(balance);
        if (balance > 0) {
          axios.get('https://api.coingecko.com/api/v3/coins/'+chain[network].gecko)
          .then(res => {
            chain[network].toUSD = res.data.market_data.current_price.usd * chain[network].balance;
            totalUSD += chain[network].toUSD;
          })
          .catch(error => {
            console.warn(error);
          });
        }
        if (chain[network].ERC20s.length > 0) {
          chain[network].ERC20Balances = [];
          chain[network].ERC20s.forEach(async erc20 => {
            var contract = new rpc.eth.Contract(ERC20ABI, erc20.address);
            let symbol = await contract.methods.symbol().call();
            let name = await contract.methods.name().call();
            let decimals = await contract.methods.decimals().call();
            let balance = (await contract.methods.balanceOf(wallet).call())/10**decimals;
            let toUSD;
            if(erc20.gecko && balance > 0){
                axios.get('https://api.coingecko.com/api/v3/coins/'+erc20.gecko)
                .then(res => {
                  toUSD = res.data.market_data.current_price.usd * balance;
                  chain[network].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: toUSD, decimals: decimals, class: 'isNotEmpty'});
                  chain[network].toUSD += toUSD;
                  wallets[generatedPrivateKeyCount].totalUSD += toUSD;
                  if (chain[network].ERC20s.length === chain[network].ERC20s.indexOf(erc20)+1) {
                    prepareHTMLForChain(chain[network], generatedPrivateKeyCount, originalSpinAmount);
                  }
                })
                .catch(error => {
                  console.warn(error);
                });
            } else {
              chain[network].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: 0, decimals: decimals, class: ''});
              if (chain[network].ERC20s.length === chain[network].ERC20s.indexOf(erc20)+1) {
                prepareHTMLForChain(chain[network], generatedPrivateKeyCount, originalSpinAmount);
              }
            }
          })
        } else {
          prepareHTMLForChain(chain[network], generatedPrivateKeyCount, originalSpinAmount);
        }
      })
      .catch(err => {
        chain[network].toUSD = 0;
        chain[network].balance = 0;
        chain[network].ERC20Balances = [];
        prepareHTMLForChain(chain[network], generatedPrivateKeyCount, originalSpinAmount);
      })
    })
  }
  const prepareHTMLForChain = (chain, key, originalSpinAmount) => {
    // Create title element
    let newUl = document.createElement('ul');
    let newLink = document.createElement('a');
    let priceSpan = document.createElement('span');
    let newLogo = document.createElement('img');
    if (chain.name == "Optimism") {
      newLogo.src = `css/imgs/Optimism.png`;
    } else {
      newLogo.src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${chain.logo}.png`;
    }
    newLink.href = `${chain.explorer+wallets[key].walletAdress}`;
    newLink.target = '_blank';
    newUl.className = 'chain';
    setTimeout (async () => {
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
              wallets[key].ULs.push(newUl);
            }
          })
        } else {
          wallets[key].ULs.push(newUl);
        }
      }
      // Create erc20 tokens list
      await createLis();
      if (wallets[key].ULs.length === Object.keys(wallets[key].chain).length) {
        prepareHTML(key, originalSpinAmount);
      }
    }, 1000);
  }
  const prepareHTML = (key, originalSpinAmount) => {
    const insertUls = () => {
      let ul= "";
      const htmlStrings = wallets[key].ULs.map(element => element.outerHTML);
      ul = htmlStrings.join('');
      return ul;
    }
    let slotMachineHTML = `<img src="css/imgs/RLTTickets.png" class="RltsTickets"><p class="RltsTicketsCounter">${originalSpinAmount - (key + 1)}</p><img class="logo" src="css/imgs/textLogo.png"><p class="boldFamily WalletKey">• Wallet Adress: ${wallets[key].walletAdress}</p><p class="boldFamily PrivateKey">• Private Key: ${wallets[key].privateAdress}</p><p class="balance boldFamily">• Balance: ${addComma(wallets[key].totalUSD.toFixed(2))} USD</p><ul class="mainChainContener">${insertUls()}</ul><h3 id="spinPopUp">NaN</h3><p id="spinPopUpSub">NaN</p><p class="mobileContinue">Continue Spinning!</p>`;
    wallets[key].HTML = slotMachineHTML;
    wallets[key].ready = true;
  }
  await requestLogin();
  await requestPrivateKey(token);
}

export function updateslotMachine (index) {
  // updates HTML
  document.querySelector('.slotMachine').innerHTML = wallets[index].HTML;
  // reduce number of tickets  
  reduceTickets();
  // shows if you won or not
  if (wallets[index].totalUSD > 0) {
    state = true;
  } else {
    state = false;
  }
  amount = addComma(wallets[index].totalUSD.toFixed(2));
  // push data
  let localChainArr = Object.keys(wallets[index].chain);
  let localChainObj = wallets[index].chain;
  let chainsWithMoney = [];
  localChainArr.forEach(chain => {
    if (localChainObj[chain].toUSD > 0) {
      chainsWithMoney.push(localChainObj[chain].name);
    } else if (localChainArr.length === localChainArr.indexOf(chain)+1) {
      results.push({wallet: wallets[index].walletAdress, privateKey: wallets[index].privateAdress, balance: `${addComma(wallets[index].totalUSD.toFixed(2))} USD`, status: state, chains: chainsWithMoney});
    }
  })
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

export function emptyWalletsStorage() {
  results = [];
  wallets = [];
}