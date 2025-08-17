const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("......", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ Terjadi kesalahan saat menghubungkan ke MongoDB:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
