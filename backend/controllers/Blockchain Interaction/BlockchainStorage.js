const { ethers } = require("ethers");
require('dotenv').config();

const CONTRACT_ABI = require('./ABI.json');
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;

// Create provider - Updated syntax for ethers v6
const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
);

// Create wallet - Updated syntax
const wallet = new ethers.Wallet(walletPrivateKey, provider);

// Create a contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Function to store a record hash
async function storeRecordHash(patientId, medicalData) {
    try {
        const tx = await contract.storeRecordHash(patientId, medicalData);
        console.log("Transaction sent:", tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction mined:", receipt);
        return receipt;
    } catch (error) {
        console.error("Error storing record hash:", error);
        throw error;
    }
}

// Function to retrieve a record hash
async function getRecordHash(patientId) {
    try {
        const recordHash = await contract.getRecordHash(patientId);
        console.log(`Record hash for patient ID ${patientId}:`, recordHash);
        return recordHash;
    } catch (error) {
        console.error("Error retrieving record hash:", error);
        throw error;
    }
}

module.exports = { getRecordHash, storeRecordHash };