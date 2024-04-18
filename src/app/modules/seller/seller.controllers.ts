import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsyncRequest';
import handleResponse from '../../utils/handleResponse';
import { sellerServices } from './seller.services';

const becomeSeller = catchAsync(async (req: Request, res: Response) => {
  const user = await sellerServices.becomeSeller(req, req.body);
  handleResponse(res, {
    statusCode: 201,
    success: true,
    message: 'seller created',
    data: user,
  });
});

const getSellerWithUserId = catchAsync(async (req: Request, res: Response) => {
  const seller = await sellerServices.getSellerByUserId(req);
  handleResponse(res, {
    statusCode: 201,
    success: true,
    message: 'seller found',
    data: seller,
  });
});

const becomeSellerControllers = {
  becomeSeller,
  getSellerWithUserId,
};

export default becomeSellerControllers;
