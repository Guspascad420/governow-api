# 🌐 Governow API

This project is a **Node.js + Express REST API** designed to manage community posts, aspirations, polls, and news data.  
It was developed as part of the **Bangkit Academy Capstone Project** and deployed on **Google Cloud Platform (GCP)**.

---

## 🚀 Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express.js  
- **File Uploads:** Multer + Google Cloud Storage  
- **Deployment:** Google Cloud Platform (GCP)


## API Endpoints
### 📰 Posts
| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| `GET`  | `/post/all`             | Retrieve all posts             |
| `POST` | `/post/create`          | Create a new post              |
| `PUT`  | `/post/:id/poll/update` | Update poll results for a post |

### 💬 Aspirations
| Method | Endpoint           | Description                                           |
| ------ | ------------------ | ----------------------------------------------------- |
| `GET`  | `/aspirations/all` | Retrieve all aspirations                              |
| `POST` | `/aspirations`     | Submit a new aspiration with optional file attachment |

### 🗞️ News
| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| `GET`  | `/news/all` | Retrieve all news articles |

### 🧑‍💼 Users & Leaders
| Method   | Endpoint   | Description                                     |
| -------- | ---------- | ----------------------------------------------- |
| `Router` | `/user`    | User-related routes (from `user.routes.js`)     |
| `Router` | `/leaders` | Leader-related routes (from `leader.routes.js`) |

### 🤖 Machine Learning Integration
| Method | Endpoint   | Description                                                  |
| ------ | ---------- | ------------------------------------------------------------ |
| `POST` | `/predict` | Handle ML-based sentiment analysis requests via `postPredictHandler` |
