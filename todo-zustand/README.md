# Todo List — React + Zustand

A Todo List app built with React and Vite. Zustand manages the app state, and Zustand's `persist` middleware saves tasks in the browser's `localStorage`.

## Features

- Add a task
- Mark a task as completed or active
- Edit a task using the edit button or double-clicking its title
- Delete a task
- Filter all, active, and completed tasks
- Clear all completed tasks
- Save tasks in `localStorage` so they remain after refreshing the page
- Responsive styling and interface animations

## Run locally

1. Install Node.js (LTS).
2. Extract this ZIP and open the `todo-zustand` folder in VS Code.
3. Open the terminal in that folder and run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal.

## Build check

Run:

```bash
npm run build
```

## Main Zustand file

`src/store/useTodoStore.js`

- `create` creates the Zustand store.
- `set` updates the state.
- `persist` saves and restores the tasks using `localStorage`.

## Deploy to GitHub Pages

The Vite base is set to `./` for relative asset paths. To publish with the configured script, run:

```bash
npm run deploy
```

Make sure Git and GitHub are configured on your computer before deploying.
