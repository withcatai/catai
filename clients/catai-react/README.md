# Catai - Modern React Client

A beautiful, modern chat interface for AI interactions built with React, Vite, and Tailwind CSS.

## Features

- **Real-time Chat**: WebSocket-based streaming responses with token-by-token display
- **Markdown Rendering**: Full markdown support with syntax highlighting for code blocks
- **Thinking Mode**: Display model thinking/reasoning tokens separately
- **Dark/Light Theme**: Seamless theme switching with persistent preferences
- **Prompt History**: Automatic history tracking with localStorage
- **Admin Settings**: JSON editor for server configuration (admin only)
- **Responsive Design**: Mobile-optimized with adaptive layouts
- **Smooth Animations**: Framer Motion-powered interactions and transitions
- **Copy to Clipboard**: One-click code block copying with feedback
- **Connection Status**: Visual indicator for server connection state

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Markdown**: React Markdown with GFM support
- **Icons**: Lucide React
- **State Management**: Zustand + React Hooks
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to the project directory
cd clients/catai-react

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
# WebSocket and API calls are proxied to http://localhost:3000
```

### Build

```bash
# Create a production build
npm run build

# Preview the production build
npm run preview
```

## Configuration

### Vite Config

The Vite configuration (`vite.config.ts`) includes:

- WebSocket proxy to `ws://localhost:3000/ws`
- REST API proxy to `http://localhost:3000/api`

Update these values in the `server.proxy` section if your backend server runs on a different port.

### Backend Requirements

The backend server should provide:

- **WebSocket endpoint**: `/ws`
    - Client events: `prompt` (send message), `abort` (stop generation)
    - Server events: `token`, `think-token`, `error`, `end`

- **REST API endpoints**:
    - `GET /api/admin` - Check admin status
    - `GET /api/admin/settings` - Get settings (admin only)
    - `POST /api/admin/settings` - Save settings (admin only)
    - `POST /api/admin/restart` - Restart server (admin only)

## Project Structure

```
src/
├── components/
│   ├── chat/              # Chat UI components
│   ├── layout/            # Header, Sidebar, Layout
│   ├── modals/            # History and Settings modals
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and API clients
├── types/                 # TypeScript type definitions
├── App.tsx               # Root component
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## Key Components

### Chat Components

- **ChatContainer**: Main chat layout with messages and input
- **MessageList**: Scrollable message list with auto-scroll
- **Message**: Individual message display with thinking toggle
- **MessageInput**: Text input with send/abort functionality
- **MarkdownRenderer**: Renders markdown with code syntax highlighting

### Modals

- **HistoryModal**: View and resend previous prompts
- **SettingsModal**: Edit server settings (admin only)

### Hooks

- **useChat**: Chat state management and WebSocket handling
- **useTheme**: Dark/light mode toggling
- **useHistory**: Prompt history with localStorage
- **useAdmin**: Admin authentication and API calls

## Features in Detail

### Dark Mode

- Toggle in header with Moon/Sun icon
- Persisted in localStorage
- Respects system preferences on first load

### Prompt History

- Automatically saves last 40 prompts
- Access via "History" button in sidebar
- Copy and resend previous prompts
- Clear history option

### WebSocket Connection

- Auto-reconnect with exponential backoff
- Connection status indicator in sidebar
- Graceful error handling
- Message queue support

### Markdown Support

- Headers, lists, tables, blockquotes
- Code blocks with language detection
- Copy button on code blocks
- Inline code styling
- Links and emphasis

## Keyboard Shortcuts

- **Ctrl/Cmd + Enter**: Send message
- **Escape**: Close modals

## Customization

### Colors

Edit `tailwind.config.js` to customize colors:

```js
colors: {
    primary: { ...
    }
,    // Main accent color
    accent: { ...
    }
,     // Secondary color
}
```

### Typography

Modify font family and sizes in `tailwind.config.js`

### Animations

Adjust animation durations and transitions in components or Tailwind config

## Performance

- Memoized message rendering to prevent unnecessary re-renders
- Lazy loading of heavy components (settings modal)
- Debounced auto-scroll
- Virtual scrolling ready for large message lists

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Connection Error

- Check if backend server is running on port 3000
- Verify WebSocket endpoint is accessible
- Check browser console for detailed error messages

### Markdown Not Rendering

- Verify markdown syntax is correct
- Check that code blocks use proper formatting with triple backticks

### Theme Not Persisting

- Clear browser localStorage if there are issues
- Check that `color-theme` key isn't blocked by browser settings

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
