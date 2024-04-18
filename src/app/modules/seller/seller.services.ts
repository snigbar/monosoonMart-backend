import { Request } from 'express';
import UserModel from '../users/user.model';
import { TSellerFormData } from './seller.validations';
import AppError from '../../Errors/AppError';
import httpStatus from 'http-status';

import { TSellerForm } from './seller.interface';
import mongoose from 'mongoose';
import SellerFormModel from './seller.model';

const becomeSeller = async (req: Request, data: TSellerFormData) => {
  const session = await mongoose.startSession();
  try {
    // start transaction
    session.startTransaction();

    const { _id, role } = req.user;
    const user = await UserModel.findById(_id);
    if (!user || role !== user.role) {
      throw new AppError('Your are not authorized', httpStatus.FORBIDDEN);
    }

    const isAlreadyRequested = await SellerFormModel.findOne({ userId: _id });

    if (isAlreadyRequested) {
      throw new AppError(
        'Already requested, wait for approval',
        httpStatus.UNAUTHORIZED,
      );
    }

    const sellerData: TSellerForm = {
      ...data,
      userId: _id,
    };

    const newSellerData = await SellerFormModel.create(sellerData);

    await session.commitTransaction();
    await session.endSession();
    return newSellerData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      error?.message || 'failed to create seller',
      httpStatus.EXPECTATION_FAILED,
    );
  }
};

const getSellerByUserId = async (req: Request) => {
  const { _id } = req.user;
  const seller = await SellerFormModel.findOne({ userId: _id });
  if (!seller) {
    throw new AppError('seller not found', httpStatus.NOT_FOUND);
  }
  return seller;
};

export const sellerServices = {
  becomeSeller,
  getSellerByUserId,
};
