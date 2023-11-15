import { webSiteAdress } from "./main.js";

let state;
let amount;

export {state, amount};

export default function generatePrivateKey() {
  let privateKey = "";
  let wallet = "";
  let totalUSD = 0;
  let chains;
  let ERC20ABI;
  const getkeys = () => {
    let result = '';
    const characters = 'ABCDEFabcdef0123456789';
    const charactersLength = characters.length;
      
    for (let i = 0; i < 64; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    privateKey = '0x'+result;
    wallet = new Web3().eth.accounts.privateKeyToAccount(privateKey).address
    document.querySelector('.PrivateKey').innerText = privateKey;
    document.querySelector('.WalletKey').innerText = wallet;
  }
  const loadChains = () => {
    fetch(`${webSiteAdress}Dapp/data/chains.json`)
    .then(response => response.json())
    .then(data => {
      chains = data;
    })
    .catch(error => console.log(error));
    loadERC20ABI();
  }

  const loadERC20ABI = () => {
    fetch(`${webSiteAdress}Dapp/data/ERC20ABI.json`)
      .then(response => response.json())
      .then(Data => {
        ERC20ABI = Data;
        getBalance();
      })
  }
  
  const getBalance = () => {
    totalUSD = 0;
    Object.keys(chains).forEach(async element => {
      const rpc = new Web3(chains[element].rpc)
      rpc.eth.getBalance(wallet).then(balance => {
        chains[element].balance = rpc.utils.fromWei(balance)
        rpc.eth.getTransactionCount(wallet).then(nonce => {
          chains[element].nonce = nonce
        })
        if (balance > 0) {
          axios.get('https://api.coingecko.com/api/v3/coins/'+chains[element].gecko)
          .then(res => {
            chains[element].toUSD = res.data.market_data.current_price.usd * chains[element].balance
            totalUSD += chains[element].toUSD
          })
          .catch(error => {
            console.error(error);
            //retry if error
            //getPrice(apiID);
          });
        }
      })

      if(chains[element].ERC20s.length > 0) {
        chains[element].ERC20Balances = []
        chains[element].ERC20s.forEach(async erc20 => {
          var contract = new rpc.eth.Contract(ERC20ABI, erc20.address);
          let symbol = await contract.methods.symbol().call()
          let name = await contract.methods.name().call()
          let decimals = await contract.methods.decimals().call()
          let balance = (await contract.methods.balanceOf(wallet).call())/10**decimals
          let toUSD;
          let className;

          if(erc20.gecko && balance > 0){
            axios.get('https://api.coingecko.com/api/v3/coins/'+erc20.gecko)
            .then(res => {
              toUSD = res.data.market_data.current_price.usd * balance
              
              if (toUSD > 0) {
                className = 'isNotEmpty';
              } else {
                className = '';
              }

              chains[element].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: toUSD, decimals: decimals, class: className})

              totalUSD += toUSD
            })
            .catch(error => {
              console.error(error);
              //retry if error
              //getPrice(apiID);
            });
          }else{
            chains[element].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: 0, decimals: decimals, className: ''})
          }
        })
      }

      updateHTML(chains[element]);
    });
  }

  const updateHTML = chain => {
    // Create title element
    let newUl = document.createElement('ul');
    let newLink = document.createElement('a');
    let newSpan = document.createElement('span');
    let newImg = document.createElement('img');
    // newLink.style.color = chain.color;
    if (chain.name == "Optimism") {
      newImg.src = `${webSiteAdress}Dapp/css/imgs/Optimism.png`;
    } else {
      newImg.src = `https://s2.coinmarketcap.com/static/img/coins/64x64/${chain.logo}.png`;
    }
    newLink.href = `${chain.explorer+wallet}`;
    newLink.target = '_blank';
    newUl.className = 'chain';
    setTimeout (() => {
      newLink.innerHTML = `${chain.name} <span>${addComma(Number(chain.balance).toFixed(2))} ${chain.symbol} (${addComma(chain.toUSD.toFixed(2))} USD)</span>`;
      newSpan.insertAdjacentElement('afterbegin', newLink);
      newSpan.insertAdjacentElement('afterbegin', newImg);
    }, 4000);
    newUl.insertAdjacentElement('beforeend', newSpan);
    document.querySelector('.mainChainContener').insertAdjacentElement('beforeend', newUl);
    // Create erc20 token list
    setTimeout(() => {
      chain.ERC20Balances.forEach(erc20 => { 
        let newLi = document.createElement('li');
        newLi.className = erc20.class;
        newLi.innerText = `${addComma(Number(erc20.balance).toFixed(2))} ${erc20.symbol} (${addComma(erc20.toUSD.toFixed(2))} USD)`;
        newUl.insertAdjacentElement('beforeend', newLi);
      })
    }, 4000);
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

  getkeys();
  loadChains();
  setTimeout(() => {
    if (totalUSD > 0) {
      state = true;
    } else {
      state = false;
    }
    amount = addComma(totalUSD.toFixed(2));
    document.querySelector('.balance').innerText = `Balance: ${addComma(totalUSD.toFixed(2))} USD`;
  }, 4500);
}