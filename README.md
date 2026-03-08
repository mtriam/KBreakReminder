# ⏱️ KBreakReminder

![KDE Plasma](https://img.shields.io/badge/KDE-Plasma%206-blue)
![License](https://img.shields.io/badge/license-GPL--3.0-green)
![KWin Script](https://img.shields.io/badge/KWin-script-orange)
![GitHub stars](https://img.shields.io/github/stars/mtriam/KBreakReminder?style=social)

**Micro-break reminder script for KWin (KDE Plasma 6+)**

KBreakReminder periodically **forces short breaks** by flashing the active window
(minimize → restore cycle).

It is designed to help reduce **eye strain**, encourage **micro-breaks**, and
interrupt long periods of continuous work.

Unlike traditional break tools such as rsibreak on Wayland, which can often be
easily bypassed (for example by simply switching the active window), this script
works directly at the KWin level and cannot be dismissed that way.

Breaks are intended not only to rest your eyes, but also to remind you to
**stand up, stretch, and step away from the computer**. Sitting for long,
uninterrupted periods is known to negatively affect overall health.

---

**Typical workflow:**

1. You work normally in any window
2. After the configured interval (default **15 minutes**) a break cycle starts
3. The active window begins **flashing**:

```
minimize → restore → minimize → restore
```

4. The flashing lasts for the configured break duration
5. Work resumes normally

Longer breaks automatically occur after several short cycles.

---

# ✨ Features

### ⏳ Automatic micro-break reminders

Breaks are triggered automatically after a configurable time interval.

Default behavior:

| Setting              | Default        |
| -------------------- | -------------- |
| Break interval       | 15 minutes     |
| Short break duration | 15 seconds     |
| Long break duration  | 60 seconds     |
| Long break frequency | every 4 cycles |

---

### 🪟 Active window flashing

Instead of passive notifications, the script **temporarily hides the active window**.

```
restore → minimize → restore → minimize
```

This forces a short pause without locking the screen.

---

### 💤 Sleep / suspend detection

The script detects system inactivity:

| Situation               | Behavior            |
| ----------------------- | ------------------- |
| short inactivity        | main timer restarts |
| system suspend / resume | timers reset        |

This prevents:

• break triggers immediately after wake
• flashing windows after system resume

---

### ⚙️ Configurable timing

All timing parameters can be configured in the script settings.

Main parameters:

```
intervalMinutes
longEveryNCycles
shortTotalSeconds
shortFlashIntervalMs
longTotalSeconds
longFlashIntervalMs
```

---

# ⌨ Behavior overview

Break cycle types:

### Short break

```
15 seconds flashing
interval: 500 ms
```

### Long break

```
60 seconds flashing
interval: 1000 ms
```

Long breaks occur every **N short cycles**.

---

# 📦 Installation (recommended)

### Install from `.kwinscript`

1. Download the latest package:

```
KBreakReminder.kwinscript
```

2. Open:

```
System Settings → Window Management → KWin Scripts
```

3. Click **Install from File…**

4. Select the downloaded package.

5. Enable **KBreakReminder**.

6. Apply changes.

The script will now be active.

---

### Alternative (manual install)

Clone the repository:

```
git clone https://github.com/mtriam/KBreakReminder.git
cd KBreakReminder
```

Run installer:

```
chmod +x KBreakReminder.sh
./KBreakReminder.sh install
```

---

# 🗑 Uninstall

You can remove the script either using the installer script or from KDE settings.

### Using the script

```
./KBreakReminder.sh uninstall
```

### From KDE settings

1. Open **System Settings → Window Management → KWin Scripts**
2. Disable **KBreakReminder**
3. Click **Remove**

---


# 🧠 Development

Project structure:

```
src/
 ├ metadata.json
 └ contents/
     ├ code/main.js
     ├ config/main.xml
     └ ui/config.ui
```

Installed to:

```
~/.local/share/kwin/scripts/KBreakReminder
```

---

# 🤖 About this project

This project was developed with assistance from **AI tools**
to accelerate development, testing and documentation.

Human design, testing and final decisions remain under the project author.

---

# 📜 License

GPL-3.0

---

# 👤 Author

**triamond**








