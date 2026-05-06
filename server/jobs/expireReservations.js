const CartReservation = require('../models/CartReservation');
const Product = require('../models/Product');

const expireReservations = async () => {
    const now = new Date();
    const expired = await CartReservation.find({ expiresAt: { $lte: now } });

    for (const reservation of expired) {
        const product = await Product.findById(reservation.productId);
        if (product) {
            product.stock += reservation.quantity;
            if (
                product.reservedBy &&
                product.reservedBy.userId &&
                product.reservedBy.userId.toString() === reservation.userId.toString()
            ) {
                product.reservedBy = undefined;
                product.reservedUntil = undefined;
            }
            await product.save();
        }
        await reservation.deleteOne();
    }
};

const startReservationCleanup = () => {
    expireReservations();
    setInterval(expireReservations, 60 * 1000);
};

module.exports = { startReservationCleanup };
