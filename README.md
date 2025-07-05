---

# Processing Portal for Adobe Photoshop

![Version](https://img.shields.io/badge/version-3.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Adobe Photoshop](https://img.shields.io/badge/Adobe-Photoshop-2D0429?logo=adobe)

A powerful, all-in-one batch exporter for Adobe Photoshop. This script processes all currently open documents, offering a rich set of options for resizing, format conversion, and automation, all within a clean, professional user interface.

It's designed to replace repetitive manual saving and streamline your entire export workflow.

![image](https://github.com/user-attachments/assets/e05af3f6-1320-41dd-9642-411efe8960ee)
---

## ✨ Key Features

*   **Multi-Format Export:** Save all open files as **WebP, JPEG, PNG, or TIFF**.
*   **Intelligent UI:** The interface dynamically shows only the relevant options for the format you choose.
*   **Automatic Folder Organisation:** Creates a neat subfolder (e.g., `/webp`, `/jpeg`) for your exported images, placing them right next to the original file.
*   **Powerful Image Processing:**
    *   Proportionally resize images by their longest edge.
    *   Set a specific PPI value.
    *   Automatically convert images to the sRGB colour space.
*   **Photoshop Actions Integration:** Run any of your existing Photoshop Actions on each image before it's saved.
*   **Persistent Settings:** The script **remembers your last used settings**, so your favorite configuration is always ready to go.
*   **Non-Destructive Workflow:** Choose to keep your original files open after the export is complete.
*   **Optimised for Speed:** A "headless" mode hides the progress bar for maximum processing speed on large batches.

## 🚀 Installation

You can follow these steps to install the script and get the best experience.

### 1. Easy Installation (Menu Access)

This will make the script available in the `File > Scripts` menu.

1.  Click on the **Code** button on this GitHub page and select **Download ZIP**.
2.  Unzip the file and locate `_Processing Portal.jsx`.
3.  Place the `_Processing Portal.jsx` file into your Photoshop `Presets/Scripts` folder.
    *   **Windows:** `C:\Program Files\Adobe\Adobe Photoshop [Version]\Presets\Scripts\`
    *   **macOS:** `/Applications/Adobe Photoshop [Version]/Presets/Scripts/`
4.  **Restart Adobe Photoshop.**

The script will now appear at the top of your **`File > Scripts`** menu. The underscore in the filename `_Processing Portal.jsx` intentionally places it at the top for easy access.

### 2. Power-User Setup (Keyboard Shortcut)

For the fastest possible access, assign a keyboard shortcut to the script.

1.  In Photoshop, open the **Actions** panel (`Window > Actions`).
2.  Create a **New Set** (the folder icon) and name it `My Scripts`.
3.  Create a **New Action** (the plus icon) inside that set.
4.  In the New Action dialog:
    *   **Name:** `Run Processing Portal`
    *   **Function Key:** Choose a key like `F5` and add `Shift` or `Ctrl`/`Cmd` as a modifier. A great, safe choice is a key that isn't already used by Photoshop.
5.  Click **Record**.
6.  Go to the menu **`File > Scripts > _Processing Portal`**.
7.  As soon as the script's dialog window appears, press the **Stop** button (the square icon) in the Actions panel.
8.  You can now click "Cancel" on the script window.

Your shortcut is now active! Pressing it will instantly launch the Processing Portal.

## 🛠️ How to Use

1.  Open multiple images in Adobe Photoshop.
2.  Run the script by using your keyboard shortcut or by going to `File > Scripts > _Processing Portal`.
3.  Configure your desired export settings in the dialog window.
4.  Click **OK**.
5.  The script will process each open document and save the new files in a subfolder next to each original.

## ⚙️ Options Explained

| Option                  | Description                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------- |
| **Save as type**        | Choose the output file format: WebP, JPEG, PNG, or TIFF.                                                |
| **Quality**             | (WebP/JPEG) Sets the image quality from 0 (lowest) to 100 (highest).                                    |
| **Compression**         | (PNG/TIFF) Choose the compression method. For PNG, "Smallest" is slower but more efficient.             |
| **Fit Longest Edge**    | Resizes the image so its longest side matches the pixel value you enter.                                |
| **Set PPI Value**       | Changes the image's resolution metadata without resampling (changing pixel count).                      |
| **Colour**               | Choose to convert the image to the standard sRGB profile or keep its existing RGB profile.              |
| **Include Metadata**    | Checkboxes to include XMP, EXIF, or (for WebP) extra Photoshop data in the final file.                  |
| **Run Action**          | Select one of your existing Photoshop Action Sets and a specific Action to run on every image.          |
| **Keep Originals Open** | If checked, your original files will remain open after the export. If unchecked, they will be closed without saving. |
| **Hide Progress**       | Disables the progress bar for a small speed increase on very large batches.                             |

## 🤝 Contributing

Issues, feature requests, and pull requests are welcome!

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

This script began its life as a simple WebP batch processor and has evolved significantly.
*   Original concept and early versions by **Stephen Marsh** on the Adobe Community forums.
*   Thanks to all community members who provided feedback and inspired new features.
## ❤️ Support
- [PayPal](https://www.paypal.com/paypalme/portal2001)
- Binanceid: 1071158826
