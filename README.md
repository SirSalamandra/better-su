# Better Su

<!-- A browser extension that enhances the user experience on [kemono.su](https://kemono.su) and [coomer.su](https://coomer.su). -->

A browser extension that enhances the user experience on specific sites with domain `.su`.

---

### 🛠️ Tech Stack

- **TypeScript**
- **Webpack**
- **Browser APIs** (Chrome & Firefox)
- **Local Storage** abstraction for persistent data

---

### ✨ Features

- ✅ Automatically adds a **"Viewed"** tag to posts you've visited
- ✅ Adds an **audio player** for posts with audio attachments
- 🟡 (Coming Soon) Button to **mark posts as unviewed**
- 🟡 (Coming Soon) Interface to **manage saved data**

---

### 🌐 Supported Browsers

- ✅ Google Chrome
- ✅ Mozilla Firefox

---

### 🚀 Installation & Build

#### 1. Clone the repository

```bash
git clone https://github.com/SirSalamandra/better-su.git
cd better-su
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Build the extension

```bash
# Build for Chrome
npm run build chrome

# Build for Firefox
npm run build firefox
```

This will generate the output in the /public directory.

---

### 📋 TODO

- [x] Add "Viewed" tag to previously accessed posts
- [ ] Button to mark post as "unviewed"
- [x] Add audio controller to posts with audio attachments
- [ ] Management interface for stored data

---

### 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or new features.

### 📄 License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

Feel free to customize this template further based on specific details and additional features of your project.
