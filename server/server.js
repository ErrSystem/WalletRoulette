// server.js
const express = require('express');
const axios = require('axios');
const web3 = require('web3');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const async = require('async');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

const users = [
  {
    id: 1,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  },
  {
    id: 2,
    username: process.env.WEBSITE_USERNAME,
    password: process.env.WEBSITE_PASSWORD,
  },
];

let secretKey = generateSecretKey();
let newSecretKey = secretKey;
let currentUsers = [];
let blacklist = [];
const cleanupInterval = 5000; // 3 seconds

// Related to generation
const networkNames = [
  'Optimism',
  'Gnosis',
  'ETC',
  'Avalanche',
  'BSC',
  'Ethereum',
  'CLO',
  'Polygon'
];

let RPCs = {
  "Optimism": [
    'https://optimism.llamarpc.com', 
    'https://op-pokt.nodies.app', 
    'https://optimism.publicnode.com', 
    'https://optimism.meowrpc.com'
  ],
  "Gnosis": [
    'https://gnosis.publicnode.com', 
    'https://gnosis.drpc.org',
    'https://gnosis-pokt.nodies.app', 
    'https://1rpc.io/gnosis'
  ],
  "ETC": [
    'https://geth-de.etc-network.info', 
    'https://etc.etcdesktop.com', 
    'https://rpc.etcinscribe.com', 
    'https://etc.rivet.link'
  ],
  "Avalanche": [
    'https://1rpc.io/avax/c', 
    'https://avalanche.drpc.org', 
    'https://avax.meowrpc.com', 
    'https://avax-pokt.nodies.app/ext/bc/C/rpc'
  ],
  "BSC": [
    'https://binance.llamarpc.com', 
    'https://bsc.publicnode.com', 
    'https://bsc.rpc.blxrbdn.com', 
    'https://bsc-pokt.nodies.app'
  ],
  "Ethereum": [
    'https://ethereum.publicnode.com',
    'https://1rpc.io/eth', 
    'https://eth-pokt.nodies.app',
    'https://eth.llamarpc.com'
  ],
  "CLO": [
    'https://rpc.callisto.network', 
    'https://rpc.callisto.network', 
    'https://rpc.callisto.network', 
    'https://rpc.callisto.network'
  ],
  "Polygon": [
    'https://polygon.llamarpc.com', 
    'https://polygon-bor.publicnode.com', 
    'https://polygon-pokt.nodies.app', 
    'https://polygon.rpc.blxrbdn.com'
  ],
};

let workingRPCs = { ...RPCs };


// Queue system vars
const loginBatchSize = 40;
const processBatchSize = 25;
let currentLoginBatch = [];
let currentProcessBatch = [];
let pendingRequestsLogin = [];
let pendingRequestsProcess = [];
let processingLogin = false;
let processingProcess = false;

function generateSecretKey() {
  const buffer = randomBytes(32);
  const secretKey = buffer.toString('hex');
  return secretKey;
}

function rotateSecretKey() {
  newSecretKey = generateSecretKey();
  keyRotationTime = Date.now();
  console.log(`Key rotated. New key: ${newSecretKey}`);
  setTimeout(() => {
    secretKey = newSecretKey;
    console.log("Cleared the old key!")
  }, 10 * 60000); // 10 minutes in milliseconds
}

setInterval(() => {
  rotateSecretKey();
}, 60 * 60000); // Rotate keys every hour (1min = 60k ms)

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, secretKey, (err, user) => { // if old/current key fails
    if (err) {
      jwt.verify(token, newSecretKey, (err, user) => { // try new one
        if (err) {
          return res.status(403).send('An error occured please try again later.'); // if fails return error
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      req.user = user;
      next();
    }
  });
}

function checkApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== process.env.WEBSITE_API_KEY) {
    return res.status(403).json({ message: 'Invalid API key' });
  }
  next();
}

function handleLoginRequest(req, res) {
  const { username, password, wallet, network } = req.body;

  // Check the origin of the request
  const origin = req.get('origin');
  // if (origin !== process.env.ALLOWED_ORIGIN) {
  //   return res.status(403).json({ message: 'Invalid origin' });
  // }

  // console.log(`${username}, ${wallet} is Connecting from ${origin}`);

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Check if the user is already in the list
  const existingUser = currentUsers.find((u) => u.wallet === wallet);

  if (existingUser) {
    // If the user is already connected, return an error
    return res.status(400).json({ message: 'User already connected' });
  }

  // Check if the user is already in the blacklist
  const blacklistedUser = blacklist.find((u) => u.wallet === wallet);

  if (blacklistedUser) {
    console.log(`${wallet} tried to connect but he is blacklisted LOL`);
    return res.status(403).json({ message: 'User is blacklisted' });
  }

  const accessToken = jwt.sign({ username: wallet, id: user.id, network: network }, newSecretKey, { expiresIn: '5m' });

  // console.log(`${wallet} got the token ${accessToken}`);

  // Add user to the currentUsers list
  currentUsers.push({
    wallet: wallet,
    count: 0,
    lastRequestTime: Date.now(),
    network: network,
    inQueue: false,
    currentLinkIndices: {
      'Optimism': 0,
      'Gnosis': 0,
      'ETC': 0,
      'Avalanche': 0,
      'BSC': 0,
      'Ethereum': 0,
      'CLO': 0,
      'Polygon': 0
    },
  });

  res.status(200).json({ accessToken });
}

const processLoginBatch = async (batch) => {
  console.log(`Processing login batch with ${batch.length} requests...`);

  await Promise.all(batch.map(async ({ req, res }) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50));

    // Your actual request handling logic goes here
    if (!res.headersSent) {
      handleLoginRequest(req, res);
    } else {
      console.log('Response already sent. Skipping.');
    }
  }));
};

const startLoginBatch = async () => {
  // Check if there are pending requests and not currently processing
  if (pendingRequestsLogin.length > 0 && !processingLogin) {
    processingLogin = true;

    // Transfer requests to the current batch
    while (currentLoginBatch.length < loginBatchSize && pendingRequestsLogin.length > 0) {
      currentLoginBatch.push(pendingRequestsLogin.shift());
    }

    try {
      // Process the current batch
      await processLoginBatch(currentLoginBatch);
    } catch (error) {
      console.error('Error processing login batch:', error);
    } finally {
      // Clear the current batch
      currentLoginBatch = [];
      processingLogin = false; // Set processing to false to allow starting another batch
      console.log('Login batch processing completed.');
    }

    // If there are still pending requests, start the next batch
    if (pendingRequestsLogin.length > 0) {
      setTimeout(startLoginBatch, 500);
    }
  }
};

app.post('/login', checkApiKey, (req, res) => {
  // Add the request to the pendingRequests array
  pendingRequestsLogin.push({ req, res });

  // If the current batch is empty and not currently processing, start processing it
  if (currentLoginBatch.length === 0 && !processingLogin) {
    setTimeout(() => startLoginBatch(), 500);
  } else {
    // If there are no more pending requests, set processingProcess to false
    processingProcess = false; // Set to false after processing the batch
  }
});

function generatePrivateKey() {
  let keys = [];
  for (let i = 1; i <= 10; i++) {
    let result = '';
    const characters = 'ABCDEFabcdef0123456789';
    const charactersLength = characters.length;  
    for (let loop = 0; loop < 64; loop++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const privateKey = '0x'+result;
    keys.push(privateKey);
  }
  return keys;
}

function getNextLinkForNetwork(network, counts) {
  const links = workingRPCs[network];
  const currentIndex = counts[network];
  const nextIndex = (currentIndex + 1) % links.length;
  counts[network] = nextIndex;
  return links[nextIndex];
}

function getSequentialRPCs(counts) {
  const sequentialRPCs = [];

  for (let loop = 0; loop < 10; loop++) {
    const loopRPCs = {};

    for (const network of networkNames) {
      const linkForNetwork = getNextLinkForNetwork(network, counts);
      loopRPCs[network] = linkForNetwork;
    }

    sequentialRPCs.push(loopRPCs);
  }

  return sequentialRPCs;
}

function handleGenerateKeysRequest(req, res) {
  const { wallet } = req.body;

  const user = currentUsers.find((u) => u.wallet === wallet);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  // Removes the user from the queue
  user.inQueue = false;

  // Update the last request time
  user.lastRequestTime = Date.now();

  // Increment the count for key generation
  user.count++;

  // Check if the count exceeds 10 for banning
  if (user.count > 10) {
    // Ban the user by adding to the blacklist
    blacklist.push({ wallet, reason: 'Exceeded key generation limit' });

    // Remove the user from the currentUsers list
    currentUsers = currentUsers.filter((u) => u.wallet !== wallet);

    return res.status(403).json({ message: 'User banned' });
  }

  const rpcLinks = getSequentialRPCs(user.currentLinkIndices);
  const privateKeys = generatePrivateKey();

  // Assuming you have a function to send private keys to the client
  // Modify this based on your actual implementation
  const result = {
    PrivateKeys: privateKeys,
    RPCs: rpcLinks,
  };

  // Return private key to the user
  res.status(200).json(result);
}

const processProcessBatch = async (batch) => {
  console.log(`Processing Process batch with ${batch.length} requests...`);

  await Promise.all(batch.map(async ({ req, res }) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50));
    if (!res.headersSent) {
      handleGenerateKeysRequest(req, res)
    } else {
      console.log('Response already sent. Skipping.');
    }
  }));

  console.log(`Finished the batch with ${batch.length} requests!`);
};

const startProcessBatch = async () => {
  if (pendingRequestsProcess.length > 0) {
    // Transfer requests to the current batch
    while (currentProcessBatch.length < processBatchSize && pendingRequestsProcess.length > 0) {
      currentProcessBatch.push(pendingRequestsProcess.shift());
    }

    // Process the current batch
    await processProcessBatch(currentProcessBatch);

    // Clear the current batch
    currentProcessBatch = [];

    // If there are still pending requests, start the next batch
    if (pendingRequestsProcess.length > 0) {
      setTimeout(() => startProcessBatch(), 500);
    } else {
      // If there are no more pending requests, set processingProcess to false
      processingProcess = false; // Set to false after processing the batch
    }
  }
};

app.post('/process', verifyToken, async (req, res) => {
  const wallet = req.body.wallet;
  const user = currentUsers.find((u) => u.wallet === wallet);

  if (user) {
    user.inQueue = true;
    user.lastRequestTime = Date.now();
  }

  // Add the request to the pendingRequests array
  pendingRequestsProcess.push({ req, res });

  // If a batch is not currently being processed, start processing
  if (!processingProcess) {
    processingProcess = true; // Set to true when starting a new batch
    setTimeout(() => startProcessBatch(), 500);
  }
});

async function testRPCs() {
  for (const network in RPCs) {
    workingRPCs[network] = [];

    for (let i = 0; i < 4; i++) {
      const linkIndex = i % RPCs[network].length;
      const link = RPCs[network][linkIndex];

      try {
        // Attempt to make a request to the RPC
        await axios.get(link);
        workingRPCs[network].push(link);
      } catch (error) {
        // Log the error, and continue to the next link
        console.error(`Error testing RPC link ${link} for network ${network}:`, error.message);

        // If there are less than 4 links, add a copy of the opposite link
        if (workingRPCs[network].length < 4) {
          const oppositeLinkIndex = (i + 2) % RPCs[network].length;
          const oppositeLink = RPCs[network][oppositeLinkIndex];
          workingRPCs[network].push(oppositeLink);
        }
      }
    }
  }

  console.log('Working RPCs:', workingRPCs);
}

setInterval(testRPCs, 5 * 60 * 1000); // every 5 mins 
setTimeout( testRPCs, 500); // when the server execute

setInterval(() => {
  const currentTime = Date.now();
  currentUsers = currentUsers.filter((user) => {
    // Remove users who haven't requested anything for x seconds
    if (user.inQueue) {
      return true;
    }

    if (currentTime - user.lastRequestTime > cleanupInterval) {
      console.log(`Cleared ${user.wallet}`);
      return false;
    }

    return true;
  });
}, 100);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});