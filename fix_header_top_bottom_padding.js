const fs = require('fs');

const cssFilePath = 'c:/Users/PAVAN NAIDU/Downloads/DHALLO/DHALLO/css/custom.css';
let cssContent = fs.readFileSync(cssFilePath, 'utf8');

// 1. Remove the zero padding rules for homepage header
const zeroPaddingRegex = /\/\* ==========================================================================\s*HOMEPAGE HEADER REMOVE TOP PADDING[\s\S]*?body\.home-page \.navbar-brand \{\s*padding-top: 0 !important;\s*margin-top: 0 !important;\s*\}/gi;

cssContent = cssContent.replace(zeroPaddingRegex, '');

// 2. Add generous header top & bottom padding rule at bottom
const headerPaddingFixCSS = `

/* ==========================================================================
   GENEROUS HEADER TOP & BOTTOM PADDING ENGINE (ALL PAGES & HOMEPAGE)
   ========================================================================== */

header.main-header,
.main-header,
.header-sticky,
.navbar,
body.home-page header.main-header,
body.home-page .header-sticky,
body.home-page .navbar {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}

.navbar-brand,
body.home-page .navbar-brand {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
    margin-top: 0 !important;
}

header.main-header .header-sticky.active .navbar {
    padding-top: 18px !important;
    padding-bottom: 18px !important;
}

@media (max-width: 768px) {
    header.main-header,
    .main-header,
    .header-sticky,
    .navbar,
    body.home-page .navbar {
        padding-top: 20px !important;
        padding-bottom: 20px !important;
    }
}
`;

fs.writeFileSync(cssFilePath, cssContent + headerPaddingFixCSS, 'utf8');
console.log('Successfully enforced generous header top and bottom padding across all pages in css/custom.css!');
