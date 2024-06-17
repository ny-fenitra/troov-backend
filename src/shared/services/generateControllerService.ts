import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Generic function to handle CRUD operations and pagination for any Mongoose model
const generateControllerService = <T>(Model: Model<T>) => {
    // Get all items with optional pagination
    const getItems = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string, 10) || null;
            const limit = parseInt(req.query.limit as string, 10) || null;

            let query = Model.find();

            // Check if pagination parameters are provided
            if (page && limit) {
                query = query.skip((page - 1) * limit).limit(limit);
            }

            const items = await query.exec();
            const total = await Model.countDocuments();
            const totalPages = page && limit ? Math.ceil(total / limit) : 1;

            return res.json({
                rows: items,
                currentPage: page,
                limit,
                total,
                totalPages,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    };

    // Get an item by ID
    const getItemById = async (req: Request, res: Response) => {
        try {
            const item = await Model.findById(req.params.id);

            if (!item) {
                return res.status(404).json({ msg: 'Item not found' });
            }

            return res.status(200).json({ success: true, item });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    };

    // Create a new item
    const createItem = async (req: Request, res: Response) => {
        const validation = validationResult(req);

        if (validation.isEmpty()) {
            const item = new Model(req.body);

            try {
                const newItem = await item.save();
                return res.status(201).json({ success: true, item: newItem });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                return res.status(400).json({ msg: err.message });
            }
        }

        return res.status(400).json({ msg: 'Validation failed', errors: validation.array() });
    };

    // Update an item by ID
    const updateItem = async (req: Request, res: Response) => {
        const validation = validationResult(req);

        if (validation.isEmpty()) {
            try {
                const item = await Model.findById(req.params.id);

                if (!item) {
                    return res.status(404).json({ msg: 'Item not found' });
                }

                Object.assign(item, req.body);

                const updateItem = await item?.save();

                return res.status(200).json({ success: true, item: updateItem });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                return res.status(400).json({ msg: err.message });
            }
        }

        return res.status(400).json({ msg: 'Validation failed', errors: validation.array() });
    };

    // Delete an item by ID
    const deleteItem = async (req: Request, res: Response) => {
        try {
            const item = await Model.findById(req.params.id);

            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }

            await Model.deleteOne({ _id: item._id });

            return res.status(200).json({ success: true, msg: 'Item deleted successfully' });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            return res.status(500).json({ msg: err.message });
        }
    };

    return {
        getItems,
        getItemById,
        createItem,
        updateItem,
        deleteItem,
    };
};

export default generateControllerService;
