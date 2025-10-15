# DigiWeave 🎨

*A full-stack web application for creatives and technical users to collect, annotate, and organize multimedia inspiration on a free-form digital canvas.*

---

## ## About The Project

Current digital collection tools can be rigid and complex. Notion has a high learning curve, and Obsidian lacks strong support for visual media. DigiWeave aims to solve this by providing an easy, fast tool for users to place media on a digital canvas, add notes, and organize their inspiration intuitively.

This project is currently in active development.

---

## ## Current Features ✨

The application currently has the following features implemented:

* **View All Collections:** The homepage fetches and displays a list of all user collections from the database.
* **Create Collections:** A form allows users to add new collections, which appear on the list instantly without a page reload.
* **Delete Collections:** Each collection has a delete button with a confirmation prompt.
* **Client-Side Routing:** The application uses React Router to navigate to a dedicated (placeholder) page for each collection.

---

## ## Tech Stack 💻

* **Backend:** Node.js, Express.js
* **Frontend:** React, React Router
* **Database:** PostgreSQL
* **Version Control:** Git

---

## ## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

* Node.js and npm installed
* PostgreSQL server running

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/hieungt02/digiweave.git](https://github.com/hieungt02/digiweave.git)
    cd digiweave
    ```

2.  **Setup the Backend:**
    * Navigate to the server directory: `cd server`
    * Install dependencies: `npm install`
    * Connect to PostgreSQL and create your database:
        ```sql
        CREATE DATABASE canvas_db;
        ```
    * Run the table creation scripts found in `database.sql` to create the `users`, `collections`, and `items` tables.
    * **Important:** Update the credentials in `server/db.js` to match your local PostgreSQL setup.
    * Start the backend server: `node index.js` (The server will be running on `http://localhost:3001`)

3.  **Setup the Frontend:**
    * Open a new terminal and navigate to the client directory: `cd client`
    * Install dependencies: `npm install`
    * Start the React development server: `npm start` (The app will open on `http://localhost:3000`)

---

## ## API Endpoints Implemented

| Method | Endpoint                    | Description                                |
| :----- | :-------------------------- | :----------------------------------------- |
| `GET`  | `/api/collections`          | Get all collections for a user.            |
| `POST` | `/api/collections`          | Create a new collection.                   |
| `PUT`  | `/api/collections/:id`      | Update a collection's name.                |
| `DELETE`| `/api/collections/:id`      | Delete a specific collection.              |
| `GET`  | `/api/collections/:id/items`| Get all items within a collection.         |
| `POST` | `/api/items`                | Add a new item to a collection.            |

---

## ## Roadmap

* [ ] Display items within the `CollectionView`.
* [ ] Implement full CRUD functionality for items on the frontend.
* [ ] Build the free-form canvas interface for arranging items.
* [ ] Implement user authentication and authorization.