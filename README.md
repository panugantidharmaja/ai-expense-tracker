# 💸 Expense Tracker

> A full-stack expense tracking app with analytics, charts, and smart budget predictions.

🔗 **Live Site:** [ai-expense-tracker-puce.vercel.app](https://ai-expense-tracker-puce.vercel.app)

---

## ✨ Features

- ➕ Add and delete expenses with amount, category, description, date, and payment method
- 📊 Analytics dashboard with daily bar chart and category pie chart
- 🔮 Smart budget predictions — projects your monthly spend based on daily averages
- 🚨 Budget overrun alerts when projected spending exceeds $2,000
- 🗂️ Category breakdown table with percentage of total and budget comparison
- 🔐 User authentication via Supabase
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

| Technology | Purpose |
| ---------- | ------- |
| React 18 + TypeScript | UI & type safety |
| Vite | Build tool & dev server |
| Redux Toolkit | Global state management |
| Tailwind CSS | Styling |
| Recharts | Bar & pie chart visualizations |
| Supabase | Authentication & database |
| Vercel | Deployment |

---

## 🚀 Run Locally

```bash
# Clone the repo
git clone https://github.com/panugantidharmaja/ai-expense-tracker.git

# Navigate into the project
cd ai-expense-tracker

# Install dependencies
npm install
```

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deployed on **Vercel** — every push to `main` auto-deploys. 🎉

---

## 📁 Project Structure

ai-expense-tracker/
├── public/
├── src/
│   ├── components/
│   │   └── layout/
│   ├── config/
│   │   └── supabaseClient.ts
│   ├── pages/
│   │   └── Analytics.tsx
│   ├── store/
│   │   ├── hooks.ts
│   │   ├── store.ts
│   │   └── slices/
│   │       └── expenseSlice.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
└── vite.config.ts

---

## 📬 Contact

- **Portfolio:** [my-portfolio-pied-kappa-75.vercel.app](https://my-portfolio-pied-kappa-75.vercel.app)
- **GitHub:** [@panugantidharmaja](https://github.com/panugantidharmaja)

---

⭐ If you found this useful, feel free to star the repo!
