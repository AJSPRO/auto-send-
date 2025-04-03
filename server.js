const express = require('express');
const { ethers } = require('ethers');
const app = express();
const port = 3000;

app.use(express.json());

// Fungsi untuk mengirim token
async function sendToken(senderPrivateKey, receiverAddress, tokenAddress, amount) {
    const provider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID");
    const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
    const tokenContract = new ethers.Contract(tokenAddress, ["function transfer(address to, uint256 amount) public returns (bool)"], senderWallet);

    const amountInUnits = ethers.parseUnits(amount.toString(), 18); // Konversi jumlah ke unit token
    const tx = await tokenContract.transfer(receiverAddress, amountInUnits);
    await tx.wait();
    return tx;
}

// Endpoint untuk mengirim token
app.post('/send', async (req, res) => {
    const { senderPrivateKey, receiverAddress, tokenAddress, amount } = req.body;
    try {
        const tx = await sendToken(senderPrivateKey, receiverAddress, tokenAddress, amount);
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
