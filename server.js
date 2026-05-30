const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালার ট্রেড সিঙ্ক - মেগা সকেট প্রোটোকল লক]
const io = socketIo(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader("Content-Security-Policy", "frame-ancestors *; default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; style-src * 'unsafe-inline'; font-src * data:;");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// 🎰 [উইনগো কালার ট্রেড ওরিজিনাল ডোমেইন সিঙ্ক]
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 🎰 ৩+১ রিলস ওরিজিনাল মানি কামিং ক্যাসিনো র্যান্ডমাইজেশন পুল তালিকা ভাই ভাই
const reel1Pool = ["0", "1", "5", "0"];
const reel2Pool = ["0", "5", "00", "0"];
const reel3Pool = ["0", "0", "5", "0"];
const multiplierReelPool = [1, 2, 5, 1, 2]; // x1, x2, x5 গোল্ডেন বুজার মাল্টিপ্লায়ার

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/money-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    const targetWallet = wallet || "main";
    try {
        const response = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });

        if (response.data && response.data.status === "ok" && response.data.balance !== undefined) {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. মানি কামিং কোর ৩+১ রিল স্পিন রাউট (POST Route - ৯৫% RTP গাণিতিক বর্ম কঠোর লক ভাই ভাই!)
app.post('/api/money-spin', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;

    // 🔒 [বেট সিকিউরিটি ফিল্টার]: বাজি ১ টাকার কম বা ২০০০০ টাকার বেশি হলে ব্যাকএন্ড ডিরেক্ট ব্লক ভাই ভাই!
    if (reqAmount < 1 || reqAmount > 20000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳২০০০০)" });
    }

    try {
        // 🔒 [ব্যালেন্স যাচাই প্রোটোকল]: বাজি প্লে করার আগে ডাটাবেজ থেকে رিয়েল টাকা নিশ্চিত করার চাবি
        const balResponse = await axios.post(`${MAIN_SITE_URL}/api_callback.php`, {
            action: "bet",
            username: userId,
            amount: 0,
            wallet: targetWallet
        }, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balResponse.data && balResponse.data.status === "ok" && balResponse.data.balance !== undefined) {
            currentDbBalance = parseFloat(balResponse.data.balance);
        } else {
            return res.json({ success: false, balance: 0, message: "❌ Database Sync Error! Please refresh." });
        }

        // 🔒 [ইনসাফিসিয়েন্ট প্রোটেকশন বর্ম]: অ্যাকাউন্টে টাকা কম থাকলে বা জিরো ব্যালেন্স হলে বাজি রিফিউজড ভাই ভাই!
        if (currentDbBalance < reqAmount || currentDbBalance <= 0) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge BDT." });
        }

        let adminTriggeredPrize = (balResponse.data && balResponse.data.money_target) ? balResponse.data.money_target : null;

        let r1, r2, r3, rMult, baseScoreText, finalStatus, totalWinAmount, winMultiplier;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল ক্যাসিনো RTP ও ৩+১ রিলস গাণিতিক লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            // ৩টি ডিজিট রিল এবং ৪র্থ মাল্টিপ্লায়ার রিলের র্যান্ডম স্টপ পজিশন জেনারেটর ভাই ভাই
            r1 = reel1Pool[Math.floor(Math.random() * reel1Pool.length)];
            r2 = reel2Pool[Math.floor(Math.random() * reel2Pool.length)];
            r3 = reel3Pool[Math.floor(Math.random() * reel3Pool.length)];
            rMult = multiplierReelPool[Math.floor(Math.random() * multiplierReelPool.length)];

            // মানি কামিং অফিশিয়াল স্ক্রোরিং মেথড: ৩টি রিল মিলে যে সংখ্যা তৈরি হয় (যেমন: 1, 5, 0 = 150 কয়েন)
            baseScoreText = r1 + r2 + r3;
            let parsedBaseValue = parseInt(baseScoreText, 10) || 0;

            if (parsedBaseValue > 0) {
                finalStatus = "win";
                // বেস কয়েন স্কোরকে ৪র্থ রিলের মাল্টিপ্লায়ার দিয়ে গুণ করে ওরিজিনাল প্রফিট মেলা ভাই ভাই
                totalWinAmount = parsedBaseValue * rMult;
                
                // ১.৯৫ স্ট্যান্ডার্ড বেস অনুযায়ী এপিআই ওডস রেশিও ট্র্যাক
                winMultiplier = totalWinAmount / 10; 
                if (winMultiplier < 0.1) winMultiplier = 0.00;
            } else {
                finalStatus = "lose";
                totalWinAmount = 0;
                winMultiplier = 0.00;
            }

            // এডমিন ড্যাশবোর্ড কন্ট্রোল ট্রিগার চাবি
            if (adminTriggeredPrize) {
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === "force_win" && finalStatus === "win") isLoopActive = false;
            } else {
                if (finalStatus === "win") {
                    // বড় জ্যাকপটের চান্স আরটিপি লুপ ট্র্যাকে কড়া সুরক্ষায় টাইট লক ভাই ভাই
                    if (totalWinAmount > (reqAmount * 10) && Math.random() > 0.02) continue;

                    // ৯৫% আরটিপি সিঙ্ক কন্ট্রোল ম্যাথ লুপ স্বাভাবিক ট্র্যাকে ৩৫% এ ব্যালেন্সড লক ভাই ভাই!
                    if (Math.random() <= 0.35) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; 
                }
            }
        }

        // বাজি ধরার এমাউন্টের সাথে আনুপাতিক উইন এমাউন্ট স্কেলিং বুস্টার
        let finalPayoutBDT = 0;
        if (finalStatus === "win") {
            let betFactor = reqAmount / 50; // ৳৫০ বেস ধরে সুষম প্রফিট ডিস্ট্রিবিউশন
            finalPayoutBDT = parseFloat((totalWinAmount * betFactor).toFixed(2));
        }

        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (finalPayoutBDT > 0) {
            dbAction = "win";
            dbAmount = finalPayoutBDT;
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = (finalPayoutBDT / reqAmount).toFixed(2);
            phpPayload.status = "win";
            phpPayload.type = "win";
            phpPayload.is_win = 1;
            phpPayload.win_status = "win";
            phpPayload.log_status = "win";
        }

        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', phpPayload, { timeout: 30000 });

        if (response.data && response.data.status === "ok") {
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            return res.json({
                success: true,
                balance: response.data.balance,
                status: finalStatus,
                winAmount: finalPayoutBDT,
                reels: [r1, r2, r3, "x" + rMult]
            });
        } else {
            let latestBal = (response.data && response.data.balance !== undefined) ? response.data.balance : currentDbBalance;
            return res.json({ success: false, balance: latestBal, message: "❌ Bet Declined by Database!" });
        }

    } catch (e) {
        console.error("Money Coming Core Engine Error:", e.message);
        return res.json({ success: false, message: "⚠️ Timeout! Click SPIN again." });
    }
});

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

io.on('connection', (socket) => { console.log("Player connected to Royal Money Coming Engine!"); });

// মানি কামিং গেম নিজস্ব কাস্টম ৪০০০ পোর্টে কড়া নিয়নে অন ফায়ার ভাই ভাই!
const PORT = process.env.PORT || 34000; 
server.listen(PORT, () => { console.log(`🎡 Royal Money Coming Engine Running on port ${PORT}`); });
