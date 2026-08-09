const fs = require("fs");
const path = require("path");

// 1. Read the template page as the source of truth
const templatePath = path.join(__dirname, "png-to-jpg.html");
if (!fs.existsSync(templatePath)) {
  console.error("Error: png-to-jpg.html not found!");
  process.exit(1);
}

const templateContent = fs.readFileSync(templatePath, "utf8");

// Extract Navbar HTML
const navStart = templateContent.indexOf('<nav class="flex items-center justify-between');
const navEnd = templateContent.indexOf("</nav>", navStart) + 6;
if (navStart === -1 || navEnd === -1) {
  console.error("Error: Could not extract Navbar from png-to-jpg.html");
  process.exit(1);
}
const navHTML = templateContent.slice(navStart, navEnd);

// Extract Footer HTML
const footerStart = templateContent.indexOf("<footer>");
const footerEnd = templateContent.indexOf("</footer>", footerStart) + 9;
if (footerStart === -1 || footerEnd === -1) {
  console.error("Error: Could not extract Footer from png-to-jpg.html");
  process.exit(1);
}
const footerHTML = templateContent.slice(footerStart, footerEnd);

// Define head additions (Tailwind, preconnects, fonts) if missing
const tailwindScript = '<script src="https://cdn.tailwindcss.com"></script>';
const fontsLink = 'href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans';

const headAdditions = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com"></script>`;

// 2. Identify all target files in the repository
const files = fs.readdirSync(__dirname);
const htmlFiles = files.filter(file => {
  if (!file.endsWith(".html")) return false;
  if (file === "index.html") return false;
  if (file === "png-to-jpg.html") return false;
  
  // Skip generated converter files: pattern from-to.html
  // except hand-crafted tools that use an x-to-y filename.
  const handCraftedXtoY = new Set([
    "pdf-to-word.html",
    "image-to-json.html",
    "image-to-base64.html",
  ]);
  if (handCraftedXtoY.has(file)) return true;

  const isConverterPattern = /^[a-z0-9]+-to-[a-z0-9]+\.html$/.test(file);
  return !isConverterPattern;
});

console.log(`Found ${htmlFiles.length} hand-crafted/custom HTML files to update.`);

// 3. Process each file
htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  let content = fs.readFileSync(filePath, "utf8");
  const originalContent = content;

  // --- CLEANUP (to make script idempotent) ---
  // Remove existing workspace wrapper and its comments
  content = content.replace(/<div class="elevra-workspace w-full[^>]*>/gi, "");
  content = content.replace(/<\/div>\s*<!-- Close \.elevra-workspace -->/gi, "");
  // Reset body tag to standard to simplify replacement
  content = content.replace(/<body[^>]*>/i, "<body>");

  // --- INJECTIONS ---
  // 1. Inject head elements if Tailwind or Plus Jakarta Sans is missing
  if (!content.includes("tailwindcss.com") || !content.includes("Plus+Jakarta+Sans")) {
    // Remove old font connects if present to avoid duplication
    content = content.replace(/<link[^>]*family=Inter[^>]*>/gi, "");
    
    // Inject before </head>
    content = content.replace("</head>", `${headAdditions}\n</head>`);
  }

  // 2. Enforce body class and wrap workspace
  content = content.replace("<body>", '<body class="elevra-theme">\n        <div class="elevra-workspace w-full flex flex-col gap-16 relative overflow-hidden">');

  // 3. Replace navbar
  const navRegex = /<nav[\s\S]*?<\/nav>/i;
  if (navRegex.test(content)) {
    content = content.replace(navRegex, navHTML);
  } else {
    // Inject navbar right after the workspace wrapper start
    const workspaceStart = '<div class="elevra-workspace w-full flex flex-col gap-16 relative overflow-hidden">';
    content = content.replace(workspaceStart, `${workspaceStart}\n            <!-- HEADER / NAVIGATION -->\n            ${navHTML}`);
  }

  // 4. Replace or add footer
  const footerRegex = /<footer[\s\S]*?<\/footer>/i;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, `${footerHTML}\n        </div> <!-- Close .elevra-workspace -->`);
  } else {
    // Place footer right before </body>, and close the wrapper
    const bodyCloseTag = "</body>";
    content = content.replace(bodyCloseTag, `\n            ${footerHTML}\n        </div> <!-- Close .elevra-workspace -->\n</body>`);
  }

  // Write changes if content modified
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`Updated: ${file}`);
  } else {
    console.log(`No changes needed for: ${file}`);
  }
});

console.log("Design system synchronization completed successfully!");
