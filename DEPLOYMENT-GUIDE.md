# TITOYIN — Complete Setup & Usage Guide
## Step-by-Step: From Zero to Live Website on GitHub Pages (Free)

---

## PART 1: DEPLOY TO GITHUB PAGES (FREE HOSTING)

### What You Need
- A free GitHub account (github.com)
- The titoyin website folder (the files you downloaded)
- About 15 minutes

---

### STEP 1: Create a GitHub Account
1. Go to **github.com**
2. Click **Sign up**
3. Enter your email, create a password, pick a username
4. Verify your email address

---

### STEP 2: Create a New Repository
1. After logging in, click the **+** icon in the top right
2. Click **New repository**
3. Repository name: type exactly `titoyin` (or your preferred name)
4. Set it to **Public** (required for free GitHub Pages)
5. Do NOT tick any of the initialise options
6. Click **Create repository**

---

### STEP 3: Upload Your Website Files
**Option A — Upload via Browser (easiest, no coding needed):**
1. On your new empty repository page, click **uploading an existing file**
2. Drag and drop the entire contents of your titoyin folder
   (all HTML files, the css folder, js folder, assets folder, feed.xml, .nojekyll)
3. Scroll down, type a short message like "Initial upload"
4. Click **Commit changes**

**Option B — Using GitHub Desktop (if you have it):**
1. Clone the repository to your computer
2. Copy all titoyin files into the cloned folder
3. Commit and push

---

### STEP 4: Enable GitHub Pages
1. In your repository, click **Settings** (top menu)
2. Scroll down to the **Pages** section in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, select **main** and folder **/ (root)**
5. Click **Save**
6. Wait 2–5 minutes, then refresh the Settings > Pages page
7. You will see a green box with your live URL:
   `https://YOUR-USERNAME.github.io/titoyin/`

**Your website is now live and free!**

---

### STEP 5: Connect Your Custom Domain (titoyin.com)
Since you already own titoyin.com:

**In GitHub:**
1. Go to Settings → Pages
2. Under **Custom domain**, type: `titoyin.com`
3. Click **Save**
4. Tick **Enforce HTTPS** once it appears

**In your domain registrar (wherever you bought titoyin.com):**
Add these DNS records:

```
Type: A     Name: @    Value: 185.199.108.153
Type: A     Name: @    Value: 185.199.109.153
Type: A     Name: @    Value: 185.199.110.153
Type: A     Name: @    Value: 185.199.111.153
Type: CNAME Name: www  Value: YOUR-USERNAME.github.io
```

DNS changes take up to 48 hours to propagate fully. After that, your site will be live at titoyin.com with a free HTTPS certificate.

---

### STEP 6: Update Links in Your Files
After setting your custom domain, update this line in every HTML file:
```
<link rel="canonical" href="https://titoyin.com">
```
Change the URL to your actual page URL for each file.

---

## PART 2: HOW TO PUBLISH A NEW ARTICLE

Since this is a static site on GitHub Pages, publishing works like this:

### Option A: Direct Upload (Easiest)
1. Create a new HTML file by copying `article.html`
2. Rename it with your story title (e.g., `fuel-price-rise-june-2025.html`)
3. Open the file and edit:
   - The `<title>` tag
   - The `<meta name="description">` tag
   - The `<h1>` article title
   - The article subtitle
   - The body content
   - The date
   - The category tag
4. Save the file
5. Go to your GitHub repository
6. Click **Add file → Upload files**
7. Upload your new HTML file
8. Commit the changes
9. Your article is live in 1–2 minutes

### Option B: Use a CMS (Recommended for regular publishing)
For a truly beginner-friendly admin panel where you can log in and publish without touching code, connect your GitHub repository to one of these FREE services:

**Recommended: Netlify CMS (now Decap CMS)**
- Free, visual editor, no coding needed
- Go to: decapcms.org
- Connects to your GitHub repository
- You log in, write your article in a simple editor, click Publish

**Alternative: Forestry.io / Tina CMS**
- Similar visual editing experience
- Also connects to GitHub

These services give you the admin dashboard described in your TOR — without needing WordPress or a paid server.

---

## PART 3: HOW TO MANAGE YOUR SITE

### Adding a New Category
1. Open `category.html`
2. Find the `catMap` object in the `<script>` at the bottom
3. Add a new entry: `tech: { title: 'Technology', desc: 'Nigerian tech news...' }`
4. Add the category pill in `index.html`
5. Update the navigation in `js/components.js`

### Enabling Breaking News
Open your browser console (F12) on any page and type:
```javascript
toggleBreakingNews("Your breaking news headline here");
```
To turn it off: `toggleBreakingNews(false);`

For a permanent change, edit `js/main.js` and add the headline in the breaking news section.

### Replacing an Ad Slot
Find any `<div class="ad-slot">` in any HTML file and replace the content with your ad image code. Example:
```html
<div class="ad-slot leaderboard">
  <a href="https://advertiser.com" target="_blank" rel="noopener">
    <img src="your-ad-banner.jpg" alt="Advertisement" width="728" height="90">
  </a>
</div>
```

### Adding Your Newsletter Service
1. Sign up free at **Mailchimp** (mailchimp.com) or **Brevo** (brevo.com)
2. Get your form embed code
3. Find `<form class="newsletter-form">` in the HTML files
4. Replace the form with your provider's embed code

### Enabling the Contact Form
The contact form needs a free form service to actually send emails:
1. Go to **formspree.io** (free tier available)
2. Create a new form
3. Get your form endpoint (looks like: `https://formspree.io/f/xxxxxxxx`)
4. In `contact.html`, change:
   ```html
   <form id="contact-form"
   ```
   to:
   ```html
   <form id="contact-form" action="https://formspree.io/f/YOUR-ID" method="POST"
   ```

### Adding Google Analytics
1. Go to analytics.google.com
2. Create a property for titoyin.com
3. Get your Measurement ID (looks like: G-XXXXXXXXXX)
4. Add this code in every HTML file, just before `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## PART 4: SOCIAL MEDIA DISTRIBUTION

### Setting Up Auto-Posting (Free)
Use **Zapier** (zapier.com) or **IFTTT** (ifttt.com) to auto-post new articles:

1. Connect your RSS feed: `https://titoyin.com/feed.xml`
2. Create a Zap: "New RSS item → Post to Twitter/X"
3. Create a Zap: "New RSS item → Post to Facebook Page"
4. When you publish a new article and add it to feed.xml, it auto-posts

### WhatsApp Channel
1. Create a WhatsApp Channel in WhatsApp
2. Paste your article links there manually after publishing

### Social Preview Setup
Every article already has Open Graph meta tags. When you share a link on WhatsApp, Facebook, or Twitter, it will automatically show a preview card.

---

## PART 5: PERFORMANCE TIPS

- **Images**: Before uploading article images, compress them at **squoosh.app** (free, no login needed). Aim for under 200KB per image.
- **All images** use `loading="lazy"` already — this means pages load fast even with many images
- **GitHub Pages CDN**: Your site is automatically served from a global CDN (Content Delivery Network), making it fast worldwide

---

## PART 6: SECURITY

- **HTTPS**: Enabled automatically and free via GitHub Pages
- **No login to hack**: Static sites have no database or admin login to attack
- **Spam protection**: The contact form uses a honeypot field to reduce spam
- **Access control**: Only GitHub account holders with repository access can edit files

---

## PART 7: BACKUP

Your entire site is backed up automatically because it lives in GitHub. Every change you make creates a version history you can roll back to.

To restore an older version:
1. Go to your repository on GitHub
2. Click on a file → **History** → choose an older version → **Restore**

---

## PART 8: FILE STRUCTURE REFERENCE

```
titoyin/
├── index.html          ← Homepage
├── article.html        ← Article template (copy for each new story)
├── category.html       ← Category listing page
├── search.html         ← Search results page
├── archive.html        ← All stories archive
├── about.html          ← About page
├── contact.html        ← Contact form page
├── privacy.html        ← Privacy policy
├── terms.html          ← Terms & conditions
├── disclaimer.html     ← Disclaimer
├── copyright.html      ← Copyright notice
├── takedown.html       ← Report / takedown request
├── ad-disclosure.html  ← Advertising disclosure
├── feed.xml            ← RSS feed (update with each new article)
├── .nojekyll           ← Tells GitHub not to process as Jekyll
├── css/
│   └── style.css       ← All styling
├── js/
│   ├── components.js   ← Header and footer (shared across all pages)
│   └── main.js         ← All interactive features
└── assets/
    └── favicon.svg     ← Site icon
```

---

## GETTING HELP

- GitHub Pages docs: docs.github.com/pages
- GitHub free support: support.github.com
- Decap CMS docs: decapcms.org/docs
- Formspree docs: formspree.io/help

---

*This guide was prepared specifically for the Titoyin website. All services mentioned in this guide offer free tiers suitable for starting out.*
