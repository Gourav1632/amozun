import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";
export const getAddresses = async (req, res) => {
    const userId = req.userId;
    const addresses = await db
        .selectFrom("user_addresses")
        .where("user_id", "=", userId)
        .selectAll()
        .orderBy("is_default", "desc")
        .execute();
    res.json({ status: "success", data: addresses });
};
export const addAddress = async (req, res) => {
    const userId = req.userId;
    const { full_name, address_line1, address_line2, city, state, zip_code, phone, is_default } = req.body;
    if (!full_name || !address_line1 || !city || !state || !zip_code || !phone) {
        throw new AppError("Missing required address fields.", 400);
    }
    const newAddressId = await db.transaction().execute(async (trx) => {
        // If this is the first address or marked as default, unset others
        if (is_default) {
            await trx
                .updateTable("user_addresses")
                .set({ is_default: false })
                .where("user_id", "=", userId)
                .execute();
        }
        const result = await trx
            .insertInto("user_addresses")
            .values({
            user_id: userId,
            full_name,
            address_line1,
            address_line2: address_line2 || null,
            city,
            state,
            zip_code,
            phone,
            is_default: is_default || false
        })
            .returning("id")
            .executeTakeFirstOrThrow();
        return result.id;
    });
    res.status(201).json({ status: "success", data: { id: newAddressId } });
};
export const deleteAddress = async (req, res) => {
    const userId = req.userId;
    const { id } = req.params;
    if (!id || typeof id !== "string") {
        throw new AppError("Address ID is required.", 400);
    }
    const result = await db
        .deleteFrom("user_addresses")
        .where("id", "=", id)
        .where("user_id", "=", userId)
        .executeTakeFirst();
    if (result.numDeletedRows === 0n) {
        throw new AppError("Address not found or unauthorized.", 404);
    }
    res.json({ status: "success", message: "Address deleted successfully." });
};
//# sourceMappingURL=addressController.js.map