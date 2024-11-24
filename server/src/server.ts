import express from 'express';
import cors from 'cors';
import { fetchDevicesRoute } from './routes/fetchDevicesRoute.js';
import { renameDeviceRoute } from './routes/renameDeviceRoute.js';
import { changeDeviceModeRoute } from './routes/changeDeviceModeRoute.js';
import { subscribeDeviceChangesRoute } from './routes/subscribeDeviceChangesRoute.js';
import { fetchAccountRoute } from './routes/fetchAccountRoute.js';
import { registerDeviceRoute } from './routes/registerDeviceRoute.js';
import { PORT } from './constants.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/devices', fetchDevicesRoute);
app.use('/devices', renameDeviceRoute);
app.use('/device-register', registerDeviceRoute);
app.use('/devices', changeDeviceModeRoute);
app.use('/subscribe-device-changes', subscribeDeviceChangesRoute);
app.use('/account', fetchAccountRoute);

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
