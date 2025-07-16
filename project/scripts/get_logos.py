import json
import asyncio
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup
import urllib.parse

def safe_print(text):
    """Prints text, ignoring encoding errors for Windows console."""
    try:
        print(text)
    except UnicodeEncodeError:
        print(text.encode('ascii', 'ignore').decode('ascii'))

# --- Configuration ---
INPUT_FILE = 'assets/data/universities.json'
OUTPUT_FILE = 'assets/data/universities.json' # Overwrite the existing file

async def fetch_logo(url):
    """Fetches the logo URL from a given university homepage."""
    if not url or not url.startswith('http'):
        safe_print(f"Skipping invalid URL: {url}")
        return None

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch()
            page = await browser.new_page()
            await page.goto(url, wait_until='domcontentloaded', timeout=60000)
            content = await page.content()
            await browser.close()
        except Exception as e:
            safe_print(f"Error visiting {url}: {e}")
            return None

    soup = BeautifulSoup(content, 'html.parser')
    
    # --- Logo Finding Logic ---
    # Common patterns for logos. This can be expanded.
    selectors = [
        'img[src*="logo"]',
        'img[alt*="logo"]',
        'img[class*="logo"]',
        'a[class*="logo"] img',
        'header img',
        'svg[class*="logo"]' # For SVG logos
    ]

    for selector in selectors:
        logo_tag = soup.select_one(selector)
        if logo_tag:
            logo_url = logo_tag.get('src') or logo_tag.get('data-src')
            if logo_url:
                # Convert relative URL to absolute
                return urllib.parse.urljoin(url, logo_url)

    safe_print(f"Could not find logo for {url} using common selectors.")
    return None

async def main():
    """Main function to read, process, and write university data."""
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
            universities = json.load(f)
    except FileNotFoundError:
        safe_print(f"Error: {INPUT_FILE} not found.")
        return

    safe_print(f"Found {len(universities)} universities. Starting logo scraping...")

    for uni in universities:
        # Skip if logo already exists and is valid
        if uni.get('logo') and uni['logo'].startswith('http'):
            safe_print(f"Logo already exists for {uni['name']}. Skipping.")
            continue

        safe_print(f"Fetching logo for: {uni['name']}")
        logo_url = await fetch_logo(uni.get('homepage'))
        if logo_url:
            uni['logo'] = logo_url
            safe_print(f"  -> Found logo: {logo_url}")
        else:
            uni['logo'] = None # Explicitly set to null if not found

    # Write the updated data back to the file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(universities, f, indent=2, ensure_ascii=False)

    safe_print(f"\nFinished! Updated university data saved to {OUTPUT_FILE}")

if __name__ == '__main__':
    asyncio.run(main())
