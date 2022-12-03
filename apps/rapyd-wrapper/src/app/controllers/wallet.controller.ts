/* eslint-disable @typescript-eslint/ban-types */

import { Request, Response } from 'express';
import { WalletCreate, ContactCreate } from '../../models/wallet.model';
import { CreateWalletInput, RetrieveWalletInput } from '../schema/wallet.schema';
import { createWallet, retrieveWallet } from '../services/wallet.service';

export const createWalletHandler = async (
  req: Request<{}, {}, CreateWalletInput['body']>, 
  res: Response
  ) => {
  try {
    const contactToCreate: ContactCreate = {
      phone_number: req.body.contact.phone_number,
      email: req.body.contact.email,
      first_name: req.body.contact.first_name,
      contact_type: req.body.contact.contact_type,
    };

    const walletToCreate: WalletCreate = {
      ewallet_reference_id: req.body.ewallet_reference_id,
      type: req.body.type,
      contact: contactToCreate,
    };

    const wallet = await createWallet(walletToCreate);
    return res.send(wallet.data);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
}

export const retrieveWalletHandler = async (
  req: Request<RetrieveWalletInput['params']>, 
  res: Response
  ) => {
  try {
    const id = req.params.walletId;
    const wallet = await retrieveWallet(id);
    return res.send(wallet.data);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e.message);
  }
}