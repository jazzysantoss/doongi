# Doongi 둥이 — virtual pet website

A virtual pet of Doongi: pet him, feed him kibble, dress him up, and do his tricks (앉아 Anja, 손 Sohn, 빵 Bang).
It works on both phone (one column) and laptop (room on the left, controls on the right).

## What's in this folder

```
doongi-site/
├── index.html    ← the page (layout + Doongi drawing)
├── style.css     ← colours, layout, phone/laptop sizes
├── script.js     ← everything he does (tricks, food, lines, saving)
├── photos/       ← the Memories photos (doongi-1.jpg … doongi-6.jpg)
└── README.md     ← this guide
```

No installs and no build step are needed. These are plain files that any web host can serve.

---

## 1. Try it on your computer first

The easiest way is to just double-click `index.html` and it opens in your browser.

If photos don't show that way, run a tiny local server instead:
1. Open a terminal in the `doongi-site` folder.
2. Run `python3 -m http.server 8000`. On Windows, use `py -m http.server 8000`.
3. Go to http://localhost:8000

To see the phone view on a laptop: right-click → **Inspect** → click the phone/tablet icon (Toggle device toolbar).

---

## 2. Put it online for free (pick ONE)

### Option A: Netlify Drop (easiest, about 2 minutes, no coding)
1. Go to **https://app.netlify.com/drop**
2. Drag the whole **`doongi-site` folder** onto the page.
3. You get a link like `https://random-name-123.netlify.app`. Send it to your friend!
4. To keep the site and give it a nicer name, make a free Netlify account, then go to **Site configuration → Change site name** (e.g. `doongi.netlify.app`).
5. To update it later: open the site in Netlify → **Deploys** → drag the folder in again.

### Option B: GitHub Pages (good if you want to keep editing the code)
1. Make a free account at **https://github.com**.
2. Click **New repository**, name it e.g. `doongi`, and make it **Public** → **Create**.
3. Click **uploading an existing file** and drag in everything *inside* `doongi-site` (index.html, style.css, script.js, the photos folder, README.md) → **Commit changes**.
4. Go to **Settings → Pages**. Under "Branch" choose **main** and **/ (root)** → **Save**.
5. Wait about 1 minute. Your link will be `https://YOUR-USERNAME.github.io/doongi/`
6. To update it later: open the file on GitHub → pencil icon ✏️ → edit → **Commit changes**.

### Option C: Vercel
Sign in at https://vercel.com → **Add New → Project**. Then either import your GitHub repo from Option B, or use the Vercel CLI (`npx vercel` inside the folder).

### Add it to your friend's phone home screen (it looks like an app)
- **iPhone (Safari):** open the link → Share button → **Add to Home Screen**.
- **Android (Chrome):** open the link → ⋮ menu → **Add to Home screen**.

---

## 3. How to change things

All of these are in **`script.js`**. Open it in any text editor (Notepad, TextEdit, or VS Code).

| Want to change… | Look for | Notes |
|---|---|---|
| What Doongi says | `say(` | Each line looks like `['😼','more peasant']`: an emoji, then the text. Lines inside `pick([...])` are chosen at random. |
| Lines when petted | `function pet(` | |
| Lines after eating | `async function feed(` | `kibble again... are we poor` is listed twice so it shows up more often. |
| Lines when he refuses a trick | `nope` | He refuses about 22% of the time (`Math.random()<.22`). |
| Random idle lines | `yo mama` | |
| How often the 🖕 shows | `Math.random()<.15?'🖕':'❤️'` | `.15` = 15% of pets. Use `.3` for more or `.05` for fewer. |
| Tricks list | `const TRICKS` | |
| Food | `const SNACKS` | `full` = how much it fills his tummy. |
| Accessories | `const HEAD` | The drawings live in `index.html` (search `data-w="bow"`). |
| Photo shown in the frame by default | `: 5);` near `setFrame` | 0 = first photo, 5 = sixth. |

**Add more Memories photos:** put e.g. `doongi-7.jpg` in `photos/`, then add `"photos/doongi-7.jpg",` to the `PHOTOS` list at the top of `script.js`.

**Colours:** at the top of `style.css`, `--green` and `--orange` set the main theme colours.

**Footer text:** in `index.html`, search `for when you miss Doongi`.

---

## Good to know
- Progress (stats, outfit, framed photo) is saved **in the browser on that device**. Phone and laptop each keep their own Doongi. To clear it, use "reset progress" at the bottom of the page.
- The fonts load from Google Fonts. Without internet the page still works, with normal fonts.
- Your hosted link is public to anyone who has it, and it includes the Memories photos.

Made for when you miss Doongi - jaja 🧡💚
