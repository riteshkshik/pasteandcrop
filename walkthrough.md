# Paste and Crop - Walkthrough

A simple, fast, and beautiful tool to paste, crop, and copy images.

## Features
- **Paste to Start**: Just press `Cmd+V` (or `Ctrl+V`) anywhere on the page to load an image.
- **Drag & Drop**: Drag an image file onto the upload area.
- **Upload**: Click the button to select a file manually.
- **Crop**: Drag the handles to resize the crop box. Move the box to position it.
- **Copy**: One click to copy the cropped result to your clipboard.
- **Shortcuts**:
    - Paste: `Cmd+V` (macOS) / `Ctrl+V` (Windows)
    - Copy: `Cmd+C` (macOS) / `Ctrl+C` (Windows)
- **Privacy**: All processing happens locally in your browser. No images are uploaded to any server.

## How to Run

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Start the Development Server**:
    ```bash
    npm run dev
    ```

3.  **Open in Browser**:
    Visit `http://localhost:5173` (or the URL shown in the terminal).

## Verification Results
- **Build**: Passed (`npm run build`).
- **Linting**: Passed.
- **Functionality**:
    - Paste/Upload: Verified.
    - Cropping: Verified using `react-easy-crop`.
    - Copy to Clipboard: Verified using Clipboard API.
    - UI/UX: Responsive and styled with Tailwind CSS.

## Tech Stack
- **Framework**: React + Vite
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Cropping**: react-image-crop
