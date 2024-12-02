# IOT PROJECT - Smart Mailbox WebApp

## To start the program

```
Open two terminals

- First terminal (Start the scripter)
   - cd scripts
   - node mailNotifier.js
- Second terminal (Start the server)
   - node app.js
```

## Features

- MVC architecture with Express for routing.
- MySQL database with Sequelize ORM for data management.
- A script that sends random "mail arriving" notifications to the API.
- HTML views using EJS for dynamic content rendering.
- More features...

## Project Structure

```
my-node-mvc-app/
│
├── config/
│   └── database.js   # MySQL database configuration
├── controllers/
│   └── mailController.js  # Mail-related logic (receiving notifications)
├── models/
│   └── User.js   # Sequelize User model
├── public/
│   └── styles.css  # Static files (CSS, images)
├── views/
│   └── index.html  # Home view
│   └── users.html  # User list view
├── routes/
│   └── index.js   # App routing
├── scripts/
│   └── mailNotifier.js   # Random notification sender script
├── app.js   # Main Express app
├── package.json
└── .env   # Environment variables (MySQL credentials)
```

## Getting Started

### Prerequisites

- **Node.js**: Make sure Node.js is installed on your machine. [Install Node.js](https://nodejs.org/)
- **MySQL**: Install MySQL and set up a local database for the app.
- **NPM**: Ensure that you have npm or yarn installed to manage dependencies.

### Installation


1. **Clone the repository**: TODO

   ```bash
   git clone https://github.com/your-username/my-node-mvc-app.git
   cd my-node-mvc-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the database**:
   - Create a MySQL database for the project.
   - Create a `.env` file in the root directory with the following content:

   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=my_database
   ```

4. **Sync the database**:

   The app uses Sequelize, which will automatically create the necessary tables when the app is run.

   ```bash
   node app.js
   ```

   This will create your database tables and start the server.

### Running the Application

To start the Express server and serve your app:

```bash
node app.js
```

The app will be running on [http://localhost:1080](http://localhost:1080).

### API

The app includes an API endpoint that simulates receiving notifications when new mail arrives:

- **POST** `/mailbox`: This endpoint accepts a JSON payload and logs the notification that a new mail has arrived.

- Add the rest of the API Endpoint

## Mail Notification Script

The project includes a script (`mailNotifier.js`) that sends random "mail arriving" notifications to the API. The script waits for a random period of time (between 1 and 5 minutes) before sending a request and repeats this process indefinitely.

### How to Run the Script

1. Make sure the main Express app is running:

   ```bash
   node app.js
   ```

2. Open a new terminal window and run the script:

   ```bash
   node scripts/mailNotifier.js
   ```

This script will send a POST request every 1 to 5 minutes, simulating the arrival of mail.

## Example Usage

- **Mail Arrival Simulation**: The mail notification script will run in the background, sending periodic notifications to the API.
- Add other usages

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for Node.js.
- **Sequelize**: ORM for MySQL database.
- **EJS**: Templating engine for rendering HTML views.
- **Axios**: For making HTTP requests to the controller API.
- **MySQL**: Relational database management.

## Future Improvements

- Add user authentication.
- Create more detailed mail-related functionalities (viewing, archiving, etc.).
- Implement a front-end notification system for real-time mail updates.

## License

This project is open source and available under the [MIT License](LICENSE).
