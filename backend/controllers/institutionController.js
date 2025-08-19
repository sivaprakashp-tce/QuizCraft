import Institution from '../models/Institution.js';
import { AppError, catchAsync } from '../middlewares/errorHandler.js';
import { validateObjectId, sanitizeInput } from '../utils/validation.js';
import logger from '../utils/logger.js';

export const createInstitution = catchAsync(async (req, res, next) => {
    const { name, address, city, country } = req.body;

    if (!name || !address || !city || !country) {
        return next(new AppError('All fields are required: name, address, city, country', 400, 'MISSING_FIELDS'));
    }

    // Check if institution already exists in the same city
    const existingInstitution = await Institution.findOne({ 
        name: sanitizeInput(name), 
        city: sanitizeInput(city) 
    });

    if (existingInstitution) {
        return next(new AppError('Institution with this name already exists in this city', 409, 'INSTITUTION_EXISTS'));
    }

    const institution = await Institution.create({
        name: sanitizeInput(name),
        address: sanitizeInput(address),
        city: sanitizeInput(city),
        country: sanitizeInput(country)
    });

    logger.info(`New institution created: ${institution.name} by ${req.user.email}`);

    res.status(201).json({
        success: true,
        message: 'Institution created successfully',
        data: {
            institution
        }
    });
});

export const getInstitution = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid institution ID', 400, 'INVALID_INSTITUTION_ID'));
    }

    const institution = await Institution.findById(id);

    if (!institution) {
        return next(new AppError('Institution not found', 404, 'INSTITUTION_NOT_FOUND'));
    }

    res.status(200).json({
        success: true,
        message: 'Institution retrieved successfully',
        data: {
            institution
        }
    });
});

export const getAllInstitutions = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, city, country } = req.query;

    // Build search query
    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { country: { $regex: search, $options: 'i' } }
        ];
    }
    if (city) {
        query.city = { $regex: city, $options: 'i' };
    }
    if (country) {
        query.country = { $regex: country, $options: 'i' };
    }

    const institutions = await Institution.find(query)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);

    const total = await Institution.countDocuments(query);

    res.status(200).json({
        success: true,
        message: 'Institutions retrieved successfully',
        data: {
            institutions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

export const updateInstitution = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, address, city, country } = req.body;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid institution ID', 400, 'INVALID_INSTITUTION_ID'));
    }

    const institution = await Institution.findById(id);
    if (!institution) {
        return next(new AppError('Institution not found', 404, 'INSTITUTION_NOT_FOUND'));
    }

    const updateData = {};
    if (name) updateData.name = sanitizeInput(name);
    if (address) updateData.address = sanitizeInput(address);
    if (city) updateData.city = sanitizeInput(city);
    if (country) updateData.country = sanitizeInput(country);

    const updatedInstitution = await Institution.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
    });

    logger.info(`Institution updated: ${updatedInstitution.name} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Institution updated successfully',
        data: {
            institution: updatedInstitution
        }
    });
});

export const deleteInstitution = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return next(new AppError('Invalid institution ID', 400, 'INVALID_INSTITUTION_ID'));
    }

    const institution = await Institution.findById(id);
    if (!institution) {
        return next(new AppError('Institution not found', 404, 'INSTITUTION_NOT_FOUND'));
    }

    // Check if any users are associated with this institution
    const User = await import('../models/User.js');
    const usersCount = await User.default.countDocuments({ institutionId: id });

    if (usersCount > 0) {
        return next(new AppError(`Cannot delete institution. ${usersCount} users are still associated with it.`, 400, 'INSTITUTION_IN_USE'));
    }

    await Institution.findByIdAndDelete(id);

    logger.info(`Institution deleted: ${institution.name} by ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Institution deleted successfully'
    });
});
