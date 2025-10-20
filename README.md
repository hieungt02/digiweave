# Digiweave

*A full-stack web application for creatives and technical users to collect, annotate, and organize multimedia inspiration on a free-form digital canvas.*

---

## ## About The Project

Current digital collection tools can be rigid and complex. Notion has a high learning curve, and Obsidian lacks strong support for visual media. Digiweave aims to solve this by providing an easy, fast tool for users to place media on a digital canvas, add notes, and organize their inspiration intuitively.

This project is currently in active development.

---

## ## Current Features

The application has a robust set of core features, centered around an interactive canvas.

* **Interactive Canvas:** Items and annotations are displayed on a free-form canvas where they can be freely moved around.
* **Drag & Drop:** All items and annotations on the canvas support drag-and-drop functionality.
* **Persistent Layouts:** The `(x, y)` position of every item and annotation is saved to the database, so your custom layouts are preserved between sessions.
* **Full CRUD for Collections, Items, and Annotations:** Users can create, read, update, and delete all data types from the frontend.
* **Item-Specific & General Annotations:** Users can add "sticky note" annotations that are attached to a specific item or free-floating on the collection's canvas.

---

## ## Tech Stack

* **Backend:** Node.js, Express.js
* **Frontend:** React, React Router, React DnD
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
    git clone [https://github.com/hieungt02/digital-canvas.git](https://github.com/hieungt02/digital-canvas.git)
    cd digital-canvas
    ```

2.  **Setup the Backend:**
    * Navigate to the server directory: `cd server`
    * Install dependencies: `npm install`
    * Connect to PostgreSQL and create your database:
        ```sql
        CREATE DATABASE canvas_db;
        ```
    * Run the necessary SQL commands to create the `users`, `collections`, `items`, and `annotations` tables.
    * **Important:** Update the credentials in `server/db.js` to match your local PostgreSQL setup.
    * Start the backend server: `node index.js` (The server will be running on `http://localhost:3001`)

3.  **Setup the Frontend:**
    * Open a new terminal and navigate to the client directory: `cd client`
    * Install dependencies: `npm install`
    * Start the React development server: `npm start` (The app will open on `http://localhost:3000`)

---

## ## API Endpoints Implemented

| Method   | Endpoint                         | Description                                  |
| :------- | :------------------------------- | :------------------------------------------- |
| `GET`    | `/api/collections`               | Get all collections.                         |
| `POST`   | `/api/collections`               | Create a new collection.                     |
| `PUT`    | `/api/collections/:id`           | Update a collection's name.                  |
| `DELETE` | `/api/collections/:id`           | Delete a collection.                         |
| `GET`    | `/api/collections/:id/items`     | Get all items within a collection.           |
| `GET`    | `/api/collections/:id/annotations`| Get all annotations within a collection.     |
| `POST`   | `/api/items`                     | Add a new item.                              |
| `PUT`    | `/api/items/:id`                 | Update an item's content.                    |
| `PUT`    | `/api/items/:id/position`        | Update an item's position.                   |
| `DELETE` | `/api/items/:id`                 | Delete an item.                              |
| `POST`   | `/api/annotations`               | Add a new annotation.                        |
| `PUT`    | `/api/annotations/:id`           | Update an annotation's content.              |
| `PUT`    | `/api/annotations/:id/position`  | Update an annotation's position.             |
| `DELETE` | `/api/annotations/:id`           | Delete an annotation.                        |

---

## ## Roadmap

With the core mechanics in place, the next steps focus on enriching the user experience and preparing for deployment.

* [ ] **Intelligent Content Rendering:** Implement logic to display items based on their `type` (e.g., render `<img>` tags for images, `<iframe>` for videos).
* [ ] **User Authentication:** Add user registration and login to create a secure, multi-tenant application.
* [ ] **Styling & UI/UX:** Refine the user interface for a cleaner and more intuitive experience.
* [ ] **Deployment:** Deploy the application to a live web server.