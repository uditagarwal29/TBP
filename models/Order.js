const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productID: {
                    type: String
                },
            }
        ],
        amount: { type: Number, required: true },
        //After making the purchase on the stripe provided payment api , it returns us an object which contains information about buyer
        address: { type: Object, required: true },
        status: { type: String, default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema)