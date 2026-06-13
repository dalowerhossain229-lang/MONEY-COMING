const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const server = http.createServer(app);

// 🎯 [মেগা সকেট প্রোটোকল লক]: হোস্টিং সার্ভার এবং টার্মাক্সের জন্য CORS এবং সকেট পথ ১০০% এরর-প্রুফ লক
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// 🎰 আপনার ওরিজিনাল মেইন সাইটের ডাটাবেজ ব্যাকএন্ড লিঙ্ক
const MAIN_SITE_URL = "https://betlover247.onrender.com"; 

// 💰 [🔒 ওস্তাদ! মেইন পিএইচপি ডাটাবেজ থেকে ওয়ালেট ব্যালেন্স এক টানে গেমের ভেতর নিয়ে আসার মেগা কিংস রাউট লক 🔒]
app.get('/api/jili-balance', async (req, res) => {
    // ফ্রন্টএন্ড থেকে আসা ইউজার আইডি এবং ওয়ালেট টাইপ রিসিভ ভাই ভাই
    const userId = req.query.userId || req.query.username || req.query.id;
    const wallet = req.query.wallet || "main";
    
    // আপনার ওরিজিনাল মেইন সাইটের ডাটাবেজ ব্যাকএন্ড লিঙ্ক
    const MAIN_SITE_URL = "https://onrender.com";

    try {
        // 🎯 ওস্তাদ! কিলার ফিক্স—আপনার পিএইচপি callback ইঞ্জিনের রিয়াল প্যারামিটার 'username' কাঁটায় কাঁটায় সিঙ্ক করা হলো!
        const response = await axios.get(`${MAIN_SITE_URL}/api_callback.php?action=get_balance&username=${userId}&wallet=${wallet}`, { timeout: 12000 });
        
        if (response.data && response.data.status === "ok") {
            return res.json({ success: true, balance: parseFloat(response.data.balance) });
        } else if (response.data && response.data.balance !== undefined) {
            return res.json({ success: true, balance: parseFloat(response.data.balance) });
        }
        return res.json({ success: false, balance: 0.00 });
    } catch (e) {
        console.error("JILI Money Balance Core Database Fetch Error:", e.message);
        return res.json({ success: false, balance: 0.00 });
    }
});


// 🛫 ২. জিলি মানি স্পিন ব্যালেন্স কাটার ও ওতো-রেজাল্ট জেনারেশন মেগা এপিআই রাউট (POST Route)
app.post('/api/jili-bet', async (req, res) => {
    const { userId, amount, wallet } = req.body;
    const betAmount = parseFloat(amount);

    try {
        // 🎯 সরাসরি আপনার পিএইচপি গেটওয়েতে হিট করে ওয়ালেট থেকে টাকা কাটা হচ্ছে ভাই ভাই
        const response = await axios.post(MAIN_SITE_URL + '/api_callback.php', { 
            action: "bet", 
            username: userId, 
            amount: betAmount, 
            wallet: wallet,
            game: "jili_money"
        }, { timeout: 15000 });

        if (response.data && response.data.status === "ok") {
            
            // 🎰 [🔒 ওস্তাদ! জিলির অফিশিয়াল ৩+১ স্লট আরএনজি (RNG) ম্যাট্রিক্স অ্যালগরিদম লক 🔒]
            // বামের ৩টি রিল মানি ভ্যালু পুল এবং ডানের বুস্টার রিল পুল ডিক্লেয়ার ভাই ভাই!
            const reel1Options =[0,1,5,10];
            const reel2Options = [0, "00", 1, 5];
            const reel3Options =[0,1,5,0];
            const boosterOptions = ["X2", "FREE SPIN", "X5", "JOKER", "X10"];

            let digit1 = reel1Options[Math.floor(Math.random() * reel1Options.length)];
            let digit2 = reel2Options[Math.floor(Math.random() * reel2Options.length)];
            let digit3 = reel3Options[Math.floor(Math.random() * reel3Options.length)];
            let booster = boosterOptions[Math.floor(Math.random() * boosterOptions.length)];

            // ওস্তাদ! ৩টি রিলের মান জোড়া লাগিয়ে মেইন বেইজ উইন সংখ্যা বের করার কিংস মেকানিজম!
            let d1Str = String(digit1);
            let d2Str = String(digit2);
            let d3Str = String(digit3);
            
            // যদি ডবল জিরো '00' পড়ে তবে আগের অঙ্কের পাশে দুইটা শূন্য বসবে ভাই ভাই!
            let baseWinString = d1Str + (d2Str === "00" ? "00" : d2Str) + d3Str;
            let baseWinValue = parseInt(baseWinString) || 0;

            // বুস্টার মাল্টিপ্লায়ার ফ্যাক্টর সিঙ্ক লুপ লক ভাই ভাই
            let finalMultiplier = 1;
            if (booster === "X2") finalMultiplier = 2;
            if (booster === "X5") finalMultiplier = 5;
            if (booster === "X10") finalMultiplier = 10;
            if (booster === "JOKER") finalMultiplier = 15; // জোকার টিকিটে সরাসরি ১৫ গুণ ধামাকা!
            if (booster === "FREE SPIN") finalMultiplier = 3;  // ফ্রি স্পিন বোনাসে বেসিক ৩ গুণ ভাই!

            // চূড়ান্ত উইনিং লাভ ক্যাশআউট ভ্যালু হিসাব লক ওস্তাদ!
            let totalWinCash = baseWinValue > 0 ? (baseWinValue * finalMultiplier) : 0;

            // 🎰 প্লেয়ার উইন হলে তার ওরিজনাল ওয়ালেটে প্লাস করার জন্য মেগা অবজেক্ট হিট লক ভাই!
            if (totalWinCash > 0) {
                try {
                    await axios.post(MAIN_SITE_URL + '/api_callback.php', { 
                        action: "win",
                        username: userId,
                        amount: parseFloat(totalWinCash), 
                        bet_amount: betAmount,
                        multiplier: finalMultiplier.toFixed(2),
                        status: "win",
                        game: "jili_money",
                        wallet: wallet
                    }, { timeout: 15000 });
                } catch (winErr) {
                    console.error("JILI Money auto-credit error:", winErr.message);
                }
            }

            // সকেটের মেইন পাইপলাইনে তাজা ব্যালেন্স ব্রডকাস্ট ফায়ার
            io.emit("balanceUpdate", { username: userId, balance: response.data.balance });

            // ফ্রন্টঅ্যান্ড রিলে সুনির্দিষ্ট ঘর থামাতে এবং টাকা ফ্লাশ করতে নিখুঁত ম্যাট্রিক্স রিটার্ন ভাই ভাই!
            return res.json({ 
                success: true, 
                balance: response.data.balance,
                winDigits: [digit1, digit2, digit3],
                booster: booster,
                winAmount: totalWinCash
            });

        } else { 
            return res.json({ success: false, message: response.data.message || "❌ Balance deduction failed!" }); 
        }
    } catch (e) { 
        console.error("JILI Money Core Database Connection Error:", e.message);
        return res.json({ success: false, message: "⚠️ Connection Timeout! Try again." }); 
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("Player socket attached to VIP JILI Money Coming Engine!");
});

// 🌐 [🔒 ওস্তাদ! রেন্ডার হোস্টিং এবং টার্মাক্সের জন্য পোর্ট ৯৯৯৯ কড়া কিংস বর্ম লক ফায়ার 🔒]
const PORT = process.env.PORT || 34000;
server.listen(PORT, () => {
    console.log(`🎰 VIP JILI Money Coming Casino Engine Running on port 9999`);
});
