export default async function handler(req, res) {
    const { fileId } = req.query;
    
    // এই টোকেনটি আমরা পরে Vercel-এর Settings-এ সেট করব, কোডে সরাসরি থাকবে না।
    const BOT_TOKEN = process.env.BOT_TOKEN; 

    if (!fileId) {
        return res.status(400).json({ error: "File ID is required" });
    }

    try {
        // ১. টেলিগ্রাম থেকে ভিডিওর পাথ (Path) খুঁজে বের করা
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
        const data = await response.json();

        if (data.ok) {
            // ২. ডিরেক্ট ভিডিও স্ট্রিমিং লিঙ্ক তৈরি করা
            const videoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${data.result.file_path}`;
            res.status(200).json({ url: videoUrl });
        } else {
            res.status(404).json({ error: "টেলিগ্রাম থেকে ভিডিওটি পাওয়া যায়নি।" });
        }
    } catch (error) {
        res.status(500).json({ error: "সার্ভারে সমস্যা হয়েছে।" });
    }
          }
