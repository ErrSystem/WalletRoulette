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
  const loadData = () => {
    fetch('/Dapp/data/chains.json')
    .then(response => response.json())
    .then(data => {
      chains = data;
      fetch('/Dapp/data/ERC20ABI.json')
      .then(response => response.json())
      .then(Data => {
        ERC20ABI = Data;
        getBalance();
      })
    })
    .catch(error => console.log(error));
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

      updateHTML(chains[element]);
    });
  }

  const updateHTML = chain => {
    // Update Balance
    document.querySelector('.balance').innerText = `Balance: ${totalUSD} USD`;
    // Create title element
    let newUl = document.createElement('ul');
    let newLink = document.createElement('a');
    let newSpan = document.createElement('span');
    newLink.innerText = `${chain.name}`;
    newLink.href = `${chain.explorer+wallet}`;
    newLink.target = '_blank';
    newUl.className = 'chain';
    newSpan.innerText = `${chain.balance} ${chain.symbol} (${chain.toUSD} USD) on `;
    newSpan.insertAdjacentElement('beforeend', newLink);
    newUl.insertAdjacentElement('beforeend', newSpan);
    document.querySelector('.mainChainContener').insertAdjacentElement('beforeend', newUl);
    // Create erc20
    console.log(chain.ERC20Balances)
    for (let erc20 in chain.ERC20Balances) {
      let newLi = document.createElement('li');
      newLi.innerText = `${erc20.balance} ${erc20.symbol} (${erc20.toUSD} USD)`;
      newUl.insertAdjacentElement('beforeend', newLi);
    }
  }

  getkeys();
  loadData();
}