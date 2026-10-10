# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## API configuration

The frontend uses `VITE_CODESPACE_NAME` to reach the API exposed by a GitHub Codespace. Define it in `octofit-tracker/frontend/.env.local` with your Codespace name:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite reads this value when it starts, so restart the development server after changing `.env.local`. When the variable is unset, the app safely falls back to `http://localhost:8000` for local development.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
