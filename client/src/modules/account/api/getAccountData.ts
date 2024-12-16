import axios from 'axios';
import { BASE_URL } from '@/modules/shared/constants.ts';

export const getAccountData = async () => axios(`${BASE_URL}/account`);
