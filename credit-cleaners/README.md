# Credit Cleaners - Optimized Landing Page

A fully optimized, SEO-friendly landing page for credit repair and debt solutions services. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **SEO Optimized**: Complete meta tags, structured data, and accessibility improvements
- **TypeScript**: Full type safety with strict configuration
- **Component Architecture**: Modular, reusable components
- **Form Validation**: Comprehensive client and server-side validation
- **Chat Widget**: Smart local chat with slot-filling
- **Responsive Design**: Mobile-first approach with glass morphism effects
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundles
- **Security**: Input sanitization, rate limiting, and honeypot protection

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credit-cleaners
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration (Required)
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # Email Octopus Configuration (Optional)
   EMAILOCTOPUS_API_KEY=your_email_octopus_api_key_here
   EMAILOCTOPUS_LIST_ID=your_email_octopus_list_id_here

   # App Configuration
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Create a `leads` table with the following schema:
   ```sql
   CREATE TABLE leads (
     id SERIAL PRIMARY KEY,
     source TEXT NOT NULL,
     timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     mode TEXT,
     full_name TEXT NOT NULL,
     email TEXT NOT NULL,
     phone TEXT NOT NULL,
     postcode TEXT,
     debt_amount INTEGER,
     debt_types TEXT[],
     consent_contact BOOLEAN NOT NULL,
     consent_privacy BOOLEAN NOT NULL,
     utm_source TEXT,
     utm_medium TEXT,
     utm_campaign TEXT,
     ip TEXT,
     user_agent TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
credit-cleaners/
├── components/          # Reusable React components
│   ├── Header.tsx      # Navigation and header
│   ├── Features.tsx    # Feature list component
│   ├── LeadForm.tsx    # Main lead capture form
│   ├── TrustSection.tsx # Trust indicators
│   ├── Reviews.tsx     # Testimonials carousel
│   ├── Footer.tsx      # Footer with structured data
│   └── ChatWidget.tsx  # Smart chat interface
├── lib/                # Utility functions and types
│   ├── types.ts        # TypeScript interfaces
│   ├── validation.ts   # Form validation functions
│   ├── constants.ts    # App constants and config
│   ├── utils.ts        # Helper functions
│   ├── env.ts          # Environment validation
│   └── supabase.ts     # Database configuration
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper with SEO
│   ├── index.tsx       # Main landing page
│   └── api/            # API routes
│       └── lead.ts     # Lead submission endpoint
└── styles/             # Global styles
    └── globals.css     # Tailwind and custom styles
```

## 🎨 Design Features

- **Glass Morphism**: Modern glass card effects with animations
- **Soft Blue Background**: Animated gradient background
- **Responsive Layout**: Mobile-first design with breakpoint optimization
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation
- **Performance**: Optimized animations and reduced motion support

## 🔧 Configuration

### SEO Settings
Edit `lib/constants.ts` to customize:
- Page title and description
- Keywords and meta tags
- Company information
- Contact details

### Form Configuration
- Toggle between single-step and two-step forms
- Customize validation rules
- Modify debt amount ranges
- Update consent text

### Chat Widget
- Customize chat prompts
- Modify validation logic
- Update conversation flow

## 📊 Analytics & Tracking

The application includes:
- Form submission tracking
- Chat interaction analytics
- Exit-intent detection
- Conversion funnel tracking

## 🔒 Security Features

- **Input Sanitization**: All user inputs are sanitized
- **Rate Limiting**: API endpoints are rate-limited
- **Honeypot Protection**: Bot detection via hidden fields
- **CORS Protection**: Proper CORS headers
- **Environment Validation**: Required environment variables are validated

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## 📈 Performance Optimizations

- **Code Splitting**: Automatic component-level code splitting
- **Image Optimization**: Next.js built-in image optimization
- **Bundle Analysis**: Use `npm run build` to analyze bundle size
- **Caching**: Static assets are cached appropriately
- **Lazy Loading**: Components load only when needed

## 🧪 Testing

Run the development server and test:
- Form validation
- Chat widget functionality
- Mobile responsiveness
- Accessibility features
- SEO meta tags

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team.

---

**Note**: This is a production-ready landing page optimized for conversion and SEO. Make sure to update all placeholder content and configure your environment variables before deployment.
