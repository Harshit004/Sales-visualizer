# Sales Dashboard

A modern, responsive sales analytics dashboard built with Next.js 15, featuring real-time data visualization, AI-powered forecasting, and performance metrics.

**Author**: HARSHIT RAJ

## Features

### Dashboard Overview
- 📊 Real-time KPI tracking (Revenue, Orders, Customers, Growth)
- 📈 Interactive charts and visualizations
- 🌙 Dark/Light mode support
- 📱 Fully responsive design

### Charts & Analytics
- Revenue Trend Analysis
- Regional Sales Distribution
- Top Customers Performance
- Product Performance Metrics
- Sales Representative Analytics
- Pending Invoices Tracking
- Order Pipeline Visualization
- Customer Retention Analysis

### Advanced Features
- 🤖 AI-powered Revenue Forecasting
- 💰 Payment Realization Predictions
- 📅 Time-frame filtering (MTD, QTD, YTD)
- ⚡ Progressive loading for optimal performance

## Tech Stack

- **Framework**: Next.js 15.2.0
- **UI Library**: React
- **Styling**: Tailwind CSS
- **Charts**: amCharts 4
- **Animations**: Framer Motion
- **State Management**: React Hooks
- **Data Fetching**: Server Actions

## Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
cd sales-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
sales-dashboard/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── charts/           # Chart components
│   ├── ui/              # UI components
│   └── chart-groups/    # Grouped chart components
├── lib/                  # Utilities and helpers
│   ├── data.ts          # Data fetching logic
│   ├── types.ts         # TypeScript types
│   └── chart-data.ts    # Chart data processing
├── public/              # Static assets
└── styles/              # Global styles
\`\`\`

## Performance Optimizations

- Dynamic imports for chart components
- Intersection Observer for lazy loading
- Progressive chart loading
- Optimized bundle splitting
- Server-side rendering disabled for charts
- Efficient data processing and caching

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [amCharts](https://www.amcharts.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) 