# ⚡ PokeFight - The Arduino Game

## 🚀 Overview
This project was created as my **Arduino Final Project**. It’s a **web application** that lets you quickly and visually design and generate “Pokémon” data for your Arduino projects.

(https://github.com/Samu-Kiss/UNI-24-03-Arduino-Poke-Fight/blob/main/Poke-Fight.png?raw=true)

## ✨ Features
- 🎮 Configure up to **two players**, each with:
  - A **main Pokémon**
  - A **secondary Pokémon**
- 🎨 For each Pokémon, you can set:
  - **Name**
  - **Type** (Fire, Water, Grass, Electric, Normal)
  - **Color** (hex code or RGB)
  - **HP** (health points)
- 🔀 Action buttons:
  - **Random**: assign random values
  - **Delete**: clear that card
- 🌐 Global controls:
  - **Generate All Random**: auto-fill every card
  - **Copy Code**: copy the ready-to-use Arduino sketch to your clipboard
  - **Generate/Import ID**: serialize and share your setup
  - **Import Data**: load from camera (QR) or JSON file
  - **Clear**: reset the entire interface

## 🛠️ Technologies Used
![Arduino](https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=arduino&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## ℹ️ About
This tool emerged from the need to streamline character setup in an **Arduino-based Pokémon battle game** using RGB LEDs. Instead of manually editing code, you generate all constants and data structures for your Pokémon in just a few clicks.

## 🚀 Usage
1. Clone the repo or visit the live demo:  
   https://arduino-poke-generator.vercel.app/
2. Open the app in your browser.
3. Configure your Pokémon (or click “Generate All Random”).
4. Click **Copy Code**.
5. Paste the generated code into `PokeFight.ino` in after the comment `// PEGAR ACÁ LO COPIADO DEL WEBSITE` (Line 118).
6. Load to your Arduino
7. Play and be happy :)

## 📝 Notes

* Requires a browser with Clipboard API and `getUserMedia` support.
* Grant camera permission to scan IDs via QR.
* Customize the code template in `src/utils/template.js` as needed.

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

## 🙌 Contributing

Contributions are welcome! If you have suggestions, improvements, or find bugs, please open an issue or submit a pull request.
