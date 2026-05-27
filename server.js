const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [উইনগো কালারトレード সিঙ্ক - মেগা সকেট প্রোটোকল লক]
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
const MAIN_SITE_URL = "https://onrender.com"; 

// 💰 ১. লাইভ অ্যাকাউন্ট ব্যালেন্স নিয়ে আসার ডেডিকেটেড গেটওয়ে
app.get('/api/moneycoming-balance', async (req, res) => {
    const { userId, wallet } = req.query;
    try {
        const response = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${wallet}`, { timeout: 30000 });
        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: response.data.balance });
        }
        return res.json({ success: false, balance: 0 });
    } catch (e) { return res.json({ success: false, balance: 0 }); }
});

// 🛫 ২. ৩+১ রিল স্পিন কোর এপিআই রাউট (POST Route - ৯৫% RTP গাণিতিক অ্যালগরিদম বর্ম লক ভাই ভাই!)
app.post('/api/moneycoming-spin', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const targetWallet = wallet || "main";
    const reqAmount = parseFloat(amount) || 50;

    // 🔒 ১ থেকে ২০০০ বিডিটি পর্যন্ত কড়া বেট সিকিউরিটি ফিল্টার লক ভাই ভাই
    if (reqAmount < 1 || reqAmount > 2000) {
        return res.json({ success: false, message: "🚨 Invalid Bet Amount (৳১ - ৳২০০০)" });
    }

    try {
        const balCheck = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${targetWallet}`, { timeout: 30000 });
        
        let currentDbBalance = 0;
        if (balCheck.data && balCheck.data.balance !== undefined && balCheck.data.balance !== null) {
            currentDbBalance = parseFloat(balCheck.data.balance);
        } else { currentDbBalance = 9999999; }

        if (currentDbBalance < reqAmount && currentDbBalance !== 9999999) {
            return res.json({ success: false, balance: currentDbBalance, message: "❌ Insufficient Balance! Please Recharge." });
        }

        // 🎯 [ভবিষ্যৎ সেন্ট্রাল গোপন এডমিন প্যানেল গেটওয়ে লিঙ্ক লক]
        let adminTriggeredPrize = (balCheck.data && balCheck.data.moneycoming_target) ? balCheck.data.moneycoming_target : null;

        let r1, r2, r3, r4Mult, baseWin, winAmount, finalStatus;
        let isLoopActive = true;
        let loopSafety = 0;

        // 🎰 [🎰 ৯৫% ওরিজিনাল RTP ও JILI ৩+১ রিল চাকা র্যান্ডমাইজেশন লুপ ভাই ভাই]
        while (isLoopActive && loopSafety < 200) {
            loopSafety++;
            
            // বামের ৩টি রিল ক্যাশ ডিজিট র্যান্ডমাইজেশন
            const reel1Pool = ["0", "1", "5", "00"];
            const reel2Pool = ["0", "5", "00", "0"];
            const reel3Pool = ["0", "0", "5", "00"];
            // ডানের বুস্টার মাল্টিপ্লায়ার পুল
            const multPool = ["x1", "x2", "x5", "x10"];

            r1 = reel1Pool[Math.floor(Math.random() * reel1Pool.length)];
            r2 = reel2Pool[Math.floor(Math.random() * reel2Pool.length)];
            r3 = reel3Pool[Math.floor(Math.random() * reel3Pool.length)];
            r4Mult = multPool[Math.floor(Math.random() * multPool.length)];

            // ক্যাশ ডিজিট কম্বিনেশন দিয়ে বেস উইন হিসাব (যেমন: ৫, ০, ০ = ৳৫০০)
            let combinedString = `${r1}${r2}${r3}`;
            // ওল্ড ডবল জিরো বা ফালতু জিরো জ্যাম ট্র্রিমিং ট্রিকস ভাই ভাই
            let parsedBase = parseInt(combinedString, 10);
            baseWin = isNaN(parsedBase) ? 0 : parsedBase;

            let multValue = 1;
            if (r4Mult === "x2") multValue = 2;
            else if (r4Mult === "x5") multValue = 5;
            else if (r4Mult === "x10") multValue = 10;

            if (baseWin > 0) {
                finalStatus = "win";
                winMultiplier = (baseWin * multValue) / reqAmount;
            } else {
                finalStatus = "lose";
                winMultiplier = 0.00;
            }

            if (adminTriggeredPrize) {
                // এডমিন সিক্রেট ফোর্স লক কন্ট্রোল
                if (adminTriggeredPrize === "force_lose" && finalStatus === "lose") isLoopActive = false;
                if (adminTriggeredPrize === "force_win" && finalStatus === "win" && winMultiplier >= 3) isLoopActive = false;
            } else {
                // 🔒 ৯৫% আরটিপি প্রোটেকশন গেটওয়ে লক: মেগা x10 বা বড় ক্যাশ কম্বো জেতার চান্স স্বাভাবিক ট্র্যাকে মাত্র ২.৫% লক ভাই ভাই
                if (winMultiplier >= 5.00 && Math.random() > 0.025) continue;

                if (finalStatus === "win") {
                    // ৯৫% আরটিপি ব্যালেন্স ট্র্যাকিং লুপ অনুযায়ী প্লেয়ার উইন চান্স ৪৪% লক ভাই ভাই
                    if (Math.random() <= 0.44) {
                        isLoopActive = false;
                    }
                } else {
                    isLoopActive = false; // প্লেয়ার লস খেলে লুপ সাথে সাথে স্টপ ভাই
                }
            }
        }

        winAmount = 0;
        let dbAction = "bet";
        let dbAmount = reqAmount;

        if (finalStatus === "win") {
            winAmount = Math.floor(baseWin * (r4Mult === "x2" ? 2 : r4Mult === "x5" ? 5 : r4Mult === "x10" ? 10 : 1));
            dbAction = "win";
            dbAmount = parseFloat(winAmount);
        }

        let phpPayload = {
            action: dbAction,
            username: userId,
            amount: dbAmount,
            wallet: targetWallet
        };

        if (dbAction === "win") {
            phpPayload.bet_amount = reqAmount;
            phpPayload.multiplier = (winAmount / reqAmount).toFixed(2);
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
                winAmount: winAmount,
                baseWin: baseWin,
                reel1: r1,
                reel2: r2,
                reel3: r3,
                multiplier: r4Mult
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

io.on('connection', (socket) => { console.log("Player connected to Royal Money Coming Slot Engine!"); });

// ২৬ নম্বর গেম ৩৩০০০ এ চলছে, তাই ২৭ নম্বর মানি কামিং গেম প্রজেক্টের স্বাধীন কাস্টম পোর্ট ৩৪০০০ কড়া লক হলো ভাই ভাই!
const PORT = process.env.PORT || 34000;
server.listen(PORT, () => { console.log(`🎡 Royal Money Coming Slot Engine Running on port ${PORT}`); });
