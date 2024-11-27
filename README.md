This is a full stack project that implements a dashboard for managing devices queried from a backend REST API. The application includes functionalities for listing devices, pagination, search, sorting, editing device attributes, and real-time updates via Server-Sent Events (SSE).

## Features

- **Resizable Columns**: The table columns are resizable, allowing the user to adjust the width of each column (e.g., `name`, `type`, `state`, `id`).
- **List Devices**: Displays a list of devices with their attributes (name, type, state, and ID).
- **Pagination**: Supports switching between pages of 10 or 20 devices.
- **Sorting**: Cross-page sort devices by any attribute (name, type, state, or ID) in both ascending and descending order.
- **Filtering**: 
  - Users can filter devices by values in **any column** (name, type, state, ID). Server сross-page filtering is used.
  - **Multi-column Filtering**: Combine filters across multiple columns and pages simultaneously.
- **Interactive Graphs**:
  - Located above the table, these **color-coded circular graphs** display the count of devices for each state and type.
  - **Filter by Graph**: Click on a section of the graph to filter devices by the corresponding state or type. 
  - A **reset icon** appears at the center of the graph, allowing users to clear the applied filter for that parameter.
- **Add Devices**: Users can add new devices manually by clicking the **"+ Register device"** button.
- **Control Elements for Each Device**:
  - Change device mode (Off, Standby, Charging).
  - Action feedback is shown during loading (e.g., spinner).
- **Rename Devices**: Users can change the name of each device, with action feedback on the operation's status.
- **Real-time Updates**: The page is updated automatically when devices are created, updated, or deleted (via SSE from the backend).


