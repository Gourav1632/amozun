import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { AppError } from "../utils/AppError.js";

const validateAddress = (data: any) => {
    const { full_name, address_line1, city, state, zip_code, phone } = data;
    if (!full_name || full_name.trim().length < 2) throw new AppError("Invalid full name.", 400);
    if (!phone || !/^\d{10}$/.test(phone)) throw new AppError("Invalid 10-digit mobile number.", 400);
    if (!address_line1 || address_line1.trim().length < 5) throw new AppError("Invalid address.", 400);
    if (!city || city.trim().length < 2) throw new AppError("Invalid city.", 400);
    if (!state || state.trim().length < 2) throw new AppError("Invalid state.", 400);
    if (!zip_code || !/^\d{6}$/.test(zip_code)) throw new AppError("Invalid 6-digit Pincode.", 400);
};

export const getAddresses = async (req: Request, res: Response) => {
    const userId = req.userId!;

    const addresses = await db
        .selectFrom("user_addresses")
        .where("user_id", "=", userId)
        .selectAll()
        .orderBy("is_default", "desc")
        .execute();

    res.json({ status: "success", data: addresses });
};

export const addAddress = async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { full_name, address_line1, address_line2, city, state, zip_code, phone, is_default } = req.body;

    validateAddress(req.body);

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

export const deleteAddress = async (req: Request, res: Response) => {
    const userId = req.userId!;
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

export const updateAddress = async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;
    const { full_name, address_line1, address_line2, city, state, zip_code, phone, is_default } = req.body;

    if (!id || typeof id !== "string") {
        throw new AppError("Address ID is required.", 400);
    }

    validateAddress(req.body);

    await db.transaction().execute(async (trx) => {
        // If marked as default, unset others
        if (is_default) {
            await trx
                .updateTable("user_addresses")
                .set({ is_default: false })
                .where("user_id", "=", userId)
                .execute();
        }

        const result = await trx
            .updateTable("user_addresses")
            .set({
                full_name,
                address_line1,
                address_line2: address_line2 || null,
                city,
                state,
                zip_code,
                phone,
                is_default: is_default || false
            })
            .where("id", "=", id)
            .where("user_id", "=", userId)
            .executeTakeFirst();

        if (result.numUpdatedRows === 0n) {
            throw new AppError("Address not found or unauthorized.", 404);
        }
    });

    res.json({ status: "success", message: "Address updated successfully." });
};

export const setDefaultAddress = async (req: Request, res: Response) => {
    const userId = req.userId!;
    const { id } = req.params;

    if (!id || typeof id !== "string") {
        throw new AppError("Address ID is required.", 400);
    }

    await db.transaction().execute(async (trx) => {
        // Unset all other defaults
        await trx
            .updateTable("user_addresses")
            .set({ is_default: false })
            .where("user_id", "=", userId)
            .execute();

        // Set the specified one to default
        const result = await trx
            .updateTable("user_addresses")
            .set({ is_default: true })
            .where("id", "=", id)
            .where("user_id", "=", userId)
            .executeTakeFirst();

        if (result.numUpdatedRows === 0n) {
            throw new AppError("Address not found or unauthorized.", 404);
        }
    });

    res.json({ status: "success", message: "Default address set successfully." });
};
