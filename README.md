This is full stack project that implements a dashboard for managing devices queried from a backend REST API. The application includes functionalities for listing devices, pagination, search, sorting, editing device attributes, and real-time updates via Server-Sent Events (SSE).

## Features

- **Resizable Columns**: The table columns are resizable, allowing the user to adjust the width of each column (e.g., `name`, `type`, `state`, `id`).
- **List Devices**: Displays a list of devices with their attributes (name, type, state, and ID).
- **Pagination**: Supports switching between pages of 10 devices.
- **Search**: Allows filtering devices by parts of their name or ID (cross-page filtering).
- **Sorting**: Sort devices by any attribute (name, type, state, or ID) in both ascending and descending order.
- **Control Elements for Each Device**:
  - Change device mode (Off, Standby, Charging).
  - Action feedback is shown during loading (e.g., spinner).
- **Rename Devices**: Users can change the name of each device, with action feedback on the operation's status.
- **Real-time Updates**: The page is updated automatically when devices are created, updated, or deleted (via SSE from the backend).

