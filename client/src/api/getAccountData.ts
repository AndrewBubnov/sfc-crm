import { BASE_URL } from '@/constants.ts';
import axios from 'axios';

export const getAccountData = async () => axios(`${BASE_URL}/account`);
