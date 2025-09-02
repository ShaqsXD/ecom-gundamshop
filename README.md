# ISO Manual Management System

A comprehensive ISO compliance management system built with Laravel and TypeScript React, featuring document management, version control, and approval workflows.

## Features

### Backend (Laravel 12)
- **ISO Manual Management** - Create and manage ISO compliance manuals
- **Section Hierarchy** - Organize content with nested sections and subsections  
- **Procedure Documentation** - Document processes and procedures with detailed steps
- **Document Management** - Attach and manage supporting documents
- **Version Control** - Automatic revision tracking with change history
- **Approval Workflows** - Multi-stage approval process for manual updates
- **Search & Filtering** - Comprehensive search across all content
- **API-First Design** - RESTful API for all operations

### Frontend (TypeScript React)
- **Modern UI** - Clean, responsive interface with Tailwind CSS
- **Real-time Updates** - Seamless SPA experience with Inertia.js
- **Type Safety** - Full TypeScript coverage for better development experience
- **Component Library** - Radix UI components for accessibility
- **Dashboard Analytics** - Overview of manual status and upcoming reviews
- **Advanced Search** - Global search across manuals, sections, and procedures

## ISO Standards Supported

The system is designed to support various ISO standards including:
- **ISO 9001:2015** - Quality Management Systems
- **ISO 14001:2015** - Environmental Management Systems
- **ISO 45001:2018** - Occupational Health and Safety
- **ISO 27001:2013** - Information Security Management
- And other ISO standards with customizable sections

## Quick Start

1. **Clone and Setup**
   ```bash
   git clone <repository-url>
   cd iso-manual-system
   composer install
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database Setup**
   ```bash
   touch database/database.sqlite
   php artisan migrate
   php artisan db:seed
   ```

4. **Development Server**
   ```bash
   npm run dev
   # In another terminal:
   php artisan serve
   ```

5. **Access the Application**
   - Visit `http://localhost:8000`
   - Login with: `admin@example.com` / `password`
   - Or register a new account

## Database Schema

### Core Entities

- **iso_manuals** - Main ISO manual documents
- **manual_sections** - Hierarchical sections within manuals
- **procedures** - Detailed process documentation
- **documents** - Supporting files and templates
- **revisions** - Version history and change tracking
- **users** - System users with role-based access

### Key Relationships

- Manuals contain multiple sections (hierarchical)
- Sections can have procedures and documents
- All entities support revision tracking
- Users can be creators, approvers, and process owners

## API Endpoints

### Manuals
- `GET /api/manuals` - List all manuals with filtering
- `POST /api/manuals` - Create new manual
- `GET /api/manuals/{id}` - Get manual details
- `PUT /api/manuals/{id}` - Update manual
- `DELETE /api/manuals/{id}` - Delete manual
- `POST /api/manuals/{id}/approve` - Approve manual
- `POST /api/manuals/{id}/submit-for-review` - Submit for review

### Sections
- `GET /api/sections` - List sections
- `POST /api/sections` - Create section
- `PUT /api/sections/{id}` - Update section
- `DELETE /api/sections/{id}` - Delete section
- `POST /api/sections/reorder` - Reorder sections

### Search
- `GET /api/search/global?q={query}` - Global search

## Manual Workflow

1. **Draft** - Initial creation and editing
2. **Review** - Submit for management review
3. **Approved** - Approved and active
4. **Archived** - Superseded or obsolete

## Version Control

- Automatic revision tracking on all changes
- Major vs minor change detection
- Change summaries and reasons
- Full audit trail with timestamps
- Version incrementation for major changes

## Security Features

- Authentication required for all operations
- Role-based access control
- CSRF protection
- Input validation and sanitization
- Secure file upload handling

## Development

### Project Structure

```
├── app/
│   ├── Http/Controllers/Api/  # API controllers
│   ├── Models/               # Eloquent models
│   ├── Http/Requests/        # Form request validation
│   └── Traits/               # Reusable model traits
├── resources/
│   ├── js/
│   │   ├── components/       # React components
│   │   ├── pages/           # Inertia pages
│   │   ├── types/           # TypeScript definitions
│   │   └── lib/             # Utilities and configurations
│   └── css/                 # Stylesheets
├── database/
│   ├── migrations/          # Database migrations
│   └── seeders/             # Sample data
└── routes/                  # Application routes
```

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `composer dev` - Start all development services
- `php artisan migrate:fresh --seed` - Reset database with sample data

## Sample Data

The system includes sample data for:
- ISO 9001:2015 Quality Management System manual
- Complete section hierarchy (1-10)
- Sample procedures and documents
- User accounts for testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open-sourced software licensed under the [MIT license](LICENSE).