import express from 'express';
import cors from 'cors';
import { fetchDevicesRoute } from './routes/fetchDevices.js';
import { renameDeviceRoute } from './routes/renameDevice.js';
import { changeDeviceModeRoute } from './routes/changeDeviceMode.js';
import { subscribeDeviceChanges } from './routes/subscribeDeviceChanges.js';
import { fetchAccountRoute } from './routes/fetchAccount.js';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use('/devices', fetchDevicesRoute);
app.use('/devices', renameDeviceRoute);
app.use('/devices', changeDeviceModeRoute);
app.use('/subscribe-device-changes', subscribeDeviceChanges);
app.use('/account', fetchAccountRoute);

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
