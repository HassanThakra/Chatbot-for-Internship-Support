

# Internship Support Chatbot

A responsive **React-based AI chatbot** designed to help interns with common questions about internship policies, schedules, HR processes, IT setup, and project guidelines.

## ✅ Features

* Built-in FAQ knowledge base (General, HR, Technical, Projects, Policies)
* User & bot chat interface with smooth UI
* Similarity-based answer matching
* Upload additional FAQs (`.json` file)
* Export full chat history (`.txt`)
* Category browser button
* Clean modern UI using Tailwind + Lucide icons

## 📂 Tech Stack

* **React**
* **TailwindCSS**
* **Lucide React Icons**

## ▶️ Run the Project

```bash
npm install
npm start
```

The app will open at:
**[http://localhost:3000](http://localhost:3000)**

## 📁 Optional: Upload Custom FAQs

Upload a JSON file in this format:

```json
[
  {
    "category": "General",
    "question": "Your question here",
    "answer": "Your answer here"
  }
]
```

## 📤 Export Chat

Click **Export** to download the full conversation as a `.txt` file.


