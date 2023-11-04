import Web3 from "web3";
import axios from "axios";

let privateKey = "";
let wallet = "";
let totalUSD = 0;
let chains;

const generatePrivateKey = () => {
    let result = '';
    const characters = 'ABCDEFabcdef0123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < 64; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    privateKey = '0x'+result;
    wallet = new Web3().eth.accounts.privateKeyToAccount(privateKey).address
}

const loadChains = () => {
  fetch('/chains.json')
  .then(response => response.json())
  .then(data => chains = data)
  .catch(error => console.log(error));
}

const getBalance = () => {
  loadChains();
  totalUSD = 0;
  Object.keys(chains).forEach(async element => {
    const rpc = new Web3(chains[element].rpc)
    rpc.eth.getBalance(wallet).then(balance => {
      chains[element].balance = rpc.utils.fromWei(balance)
      rpc.eth.getTransactionCount(wallet).then(nonce => {
        chains[element].nonce = nonce
      })

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
    })

    if(chains[element].ERC20s.length > 0) {
      chains[element].ERC20Balances = []
      chains[element].ERC20s.forEach(async erc20 => {
        var contract = new rpc.eth.Contract(ERC20ABI, erc20.address);
        let symbol = await contract.methods.symbol().call()
        let name = await contract.methods.name().call()
        let decimals = await contract.methods.decimals().call()
        let balance = (await contract.methods.balanceOf(wallet).call())/10**decimals
        let toUSD

        if(erc20.gecko){
          axios.get('https://api.coingecko.com/api/v3/coins/'+erc20.gecko)
          .then(res => {
            toUSD = res.data.market_data.current_price.usd * balance

            chains[element].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: toUSD, decimals: decimals})

            totalUSD += toUSD
          })
          .catch(error => {
            console.error(error);
            //retry if error
            //getPrice(apiID);
          });
        }else{
          chains[element].ERC20Balances.push({symbol: symbol, name: name, balance: balance, toUSD: -1, decimals: decimals})
        }
      })
    }
  });
}