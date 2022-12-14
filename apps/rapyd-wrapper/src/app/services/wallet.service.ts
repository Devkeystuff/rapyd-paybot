/* eslint-disable @typescript-eslint/no-var-requires */

import RapydResponse, { RapydAxiosError } from '../../models/rapyd.model';
import { Wallet, WalletCreate } from '../../models/wallet.model';

import axios from 'axios';

import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { validateEnv } from '../../utils/validate-env';
import { getRequestHeaders } from './rapyd.service';

const prisma = new PrismaClient();

export const createWallet = async (
  wallet: WalletCreate,
  res: Response
): Promise<RapydResponse<Wallet> | void> => {
  try {
    // TODO: create user here

    if (!validateEnv) return;

    const client = axios.create({
      baseURL: process.env.BASE_URI,
    });

    return await client
      .post<RapydResponse<Wallet>>('/user', wallet, {
        headers: getRequestHeaders(
          'post',
          '/v1/user',
          JSON.parse(JSON.stringify(wallet))
        ),
      })
      .then(async (response) => {
        await prisma.wallet.create({
          data: {
            id: response.data.data.id,
            referenceId: wallet.ewallet_reference_id,
            username: wallet.contact.first_name,
            password: wallet.contact.password,
          },
        });
        return response.data;
      })
      .catch((e: RapydAxiosError) => {
        res.status(401).send(e.response.data.status);
      });
  } catch (e) {
    throw new Error(e);
  }
};

export const retrieveWallet = async (
  walletId: string
): Promise<RapydResponse<Wallet>> => {
  try {
    // TODO: create user here

    console.log(walletId);

    if (!validateEnv) return;

    const client = axios.create({
      baseURL: process.env.BASE_URI,
    });

    let walletRetrieved: RapydResponse<Wallet>;
    await client
      .get<RapydResponse<Wallet>>(`/user/${walletId}`, {
        headers: getRequestHeaders(
          'get',
          `/v1/user/${walletId}`,
          JSON.parse(JSON.stringify(''))
        ),
      })
      .then((response) => {
        walletRetrieved = response.data;
      })
      .catch((e) => {
        console.error(e);
      });

    return walletRetrieved;
  } catch (e) {
    throw new Error(e);
  }
};

export const getAllWallets = async () => {
  return prisma.wallet.findMany();
};

export const deleteWallet = async (username: string) => {
  return prisma.wallet.delete({ where: { referenceId: username } });
};
