# PostgreSQL Playground 🐘

Interactive PostgreSQL learning platform where you can create tables, establish relationships, and execute SQL queries with real-time visualization.

![PostgreSQL Playground](https://img.shields.io/badge/PostgreSQL-Playground-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## ✨ Features

- 🔍 **Advanced SQL Editor** with syntax highlighting and multiple themes
- 📊 **Schema Visualization** - View table structures and data types
- 🔗 **Relationship Mapping** - Visualize foreign key relationships
- 🌐 **Database Overview** - Complete database schema at a glance
- 📝 **Sample Queries** - Pre-built examples to get started
- 🎨 **Beautiful UI** - Modern, responsive design with Tailwind CSS
- ⌨️ **Keyboard Shortcuts** - Ctrl+Enter to execute queries

## 🚀 Quick Start

### Local Development

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd sql_workspace
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🌐 Deploy to Vercel

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/postgresql-playground)

#### Option 2: Manual Deploy

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy to production**

```bash
npm run deploy
```

4. **Or deploy preview**

```bash
npm run deploy-preview
```

## 🎮 How to Use

1. **Write SQL queries** in the advanced editor
2. **Execute queries** with the Run button or `Ctrl+Enter`
3. **Explore results** with interactive buttons:
   - 🌐 **DB Schema**: View entire database structure
   - 🔵 **Schema**: Current table column details
   - 🟣 **Relationships**: Foreign key connections

## 📚 Example Queries

```sql
-- Basic query
SELECT * FROM users;

-- JOIN query
SELECT u.name, p.title
FROM users u
JOIN posts p ON u.id = p.user_id;

-- Create new table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  user_id INTEGER,
  price DECIMAL
);

-- Insert data
INSERT INTO users (name, email, age)
VALUES ('New User', 'user@example.com', 25);
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **Editor**: CodeMirror with SQL syntax highlighting
- **Icons**: Lucide React
- **Database**: In-memory simulation (for demo purposes)
- **Deployment**: Vercel

## 📁 Project Structure

```
sql_workspace/
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── page.js       # Main page
│   │   └── layout.js     # Layout component
│   ├── components/
│   │   ├── SqlEditor.js  # SQL editor with themes
│   │   ├── QueryResults.js # Result visualization
│   │   └── TableManager.js # Table management
│   └── lib/
│       └── database.js   # Database simulation
├── public/               # Static assets
├── vercel.json          # Vercel configuration
└── package.json         # Dependencies
```

## 🎨 Themes

The SQL editor supports multiple themes:

- 🐘 **PostgreSQL** (custom theme)
- 🐱 **GitHub**
- 💙 **VS Code**
- 🌙 **One Dark**

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Optional: For production PostgreSQL connection
DATABASE_URL=postgresql://username:password@localhost:5432/database

# Optional: API rate limiting
MAX_REQUESTS_PER_MINUTE=100
```

### Vercel Configuration

The project includes a `vercel.json` with optimized settings:

- **Regions**: Frankfurt (fra1) for EU users
- **Function timeout**: 30 seconds
- **Build optimization**: Next.js integration

## 📈 Performance

- ⚡ **Fast loading** with Next.js optimization
- 🎯 **Efficient rendering** with React 19
- 💾 **Memory-based** database simulation
- 🌍 **Global CDN** deployment with Vercel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PostgreSQL** for the amazing database system
- **Next.js** team for the fantastic framework
- **Vercel** for the excellent deployment platform
- **CodeMirror** for the powerful editor component

---

**Made with ❤️ for SQL learners worldwide**

[![Powered by Vercel](https://img.shields.io/badge/Powered%20by-Vercel-black)](https://vercel.com)
