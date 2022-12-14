import Pocketbase from 'pocketbase';
import { validateEnv } from '../utils/validate-env';
import { RapydError, RapydResponse } from './models/rapydResponse';
import {
  Contact,
  CustomerCreate,
  EWallet,
  EWalletCreate,
} from './models/wallet';

import axios, { AxiosError, AxiosInstance } from 'axios';

class WalletService {
  private uri!: string;
  private client!: AxiosInstance;
  private pb!: Pocketbase;

  constructor() {
    // TODO: handle invalid env variables
    if (!validateEnv) return;
    this.uri = `${process.env.WRAPPER_URI}/api`;
    this.client = axios.create({
      baseURL: this.uri,
    });
  }

  public createEWallet = async (
    customerData: CustomerCreate
  ): Promise<RapydResponse<EWallet> | RapydError | undefined> => {
    const walletContact: Contact = {
      phone_number: customerData.phone_number,
      email: customerData.email,
      first_name: customerData.username,
      password: customerData.password,
      contact_type: 'personal',
    };

    const walletToCreate: EWalletCreate = {
      ewallet_reference_id: customerData.ds_tag,
      type: 'person',
      contact: walletContact,
    };

    const walletResponse = await this.client
      .post<RapydResponse<EWallet>>('/wallets', walletToCreate)
      .then((res) => res.data)
      .catch((e: AxiosError<RapydError>) => {
        return e.response?.data;
      });

    return walletResponse;
  };

  public retrieveEWallet = async (
    walletId: string
  ): Promise<RapydResponse<EWallet>> => {
    let walletResponse: RapydResponse<EWallet> | null;
    await this.client
      .get<RapydResponse<EWallet>>(`/wallets/${walletId}`)
      .then((response) => {
        walletResponse = response.data;
        // TODO: test log, remove
        console.log(walletResponse.data);
        console.log(walletResponse.status);
      })
      .catch((e) => {
        if (axios.isAxiosError(e)) {
          console.error(e.message);
        } else {
          console.error('Unexpected Error occurerd');
        }
        walletResponse = e;
      });

    return walletResponse!;
  };

  public updateEWallet = async (
    eWallet: EWallet
  ): Promise<RapydResponse<EWallet>> => {
    // TODO: implement update on server

    return {} as RapydResponse<EWallet>;
  };
}

export default WalletService;
