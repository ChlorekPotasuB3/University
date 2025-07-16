import json
import os
import re
import asyncio
import json
from playwright.async_api import async_playwright

# --- Configuration ---
START_URL = "https://www.educations.com/study-in-poland"
OUTPUT_FILE = 'courses.json'

# --- Globals for collecting data ---
all_courses = {}

async def handle_response(response):
    """Intercepts and processes JSON responses containing course data."""
    if response.ok and 'application/json' in response.headers.get('content-type', ''):
        try:
            data = await response.json()
            # The specific path where course results are located
            results = data.get('pageProps', {}).get('data', {}).get('searchResult', {}).get('results', [])
            
            if not results:
                return

            new_courses_found = 0
            for course in results:
                course_id = course.get('id')
                if course_id and course_id not in all_courses:
                    all_courses[course_id] = course
                    new_courses_found += 1
            
            if new_courses_found > 0:
                print(f"Captured {new_courses_found} new courses. Total unique courses: {len(all_courses)}")

        except json.JSONDecodeError:
            # Not a valid JSON response, ignore
            pass
        except Exception as e:
            print(f"Error processing response from {response.url}: {e}")

async def main():
    """Main function to run the scraper."""
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Set up the network interception
        page.on('response', handle_response)
        
        print(f"Navigating to {START_URL}...")
        await page.goto(START_URL, wait_until='domcontentloaded', timeout=60000)
        
        # Scroll until no new courses are found
        print("Scrolling to load all courses...")
        last_height = await page.evaluate('document.body.scrollHeight')
        while True:
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            # Wait for new content to load
            try:
                await page.wait_for_load_state('networkidle', timeout=5000)
            except Exception:
                print("Network idle timeout. Assuming all content is loaded.")

            await asyncio.sleep(1) # Extra wait for any JS rendering
            
            new_height = await page.evaluate('document.body.scrollHeight')
            if new_height == last_height:
                print("Reached the bottom of the page. No more new content.")
                break
            last_height = new_height

        await browser.close()

    # --- Save the final results ---
    print(f"\nScraping complete. Total unique courses found: {len(all_courses)}")
    if all_courses:
        # Convert dict back to a list for saving
        final_course_list = list(all_courses.values())
        print(f"Saving {len(final_course_list)} courses to {OUTPUT_FILE}...")
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            json.dump(final_course_list, f, indent=2, ensure_ascii=False)
        print("Successfully saved courses.")
    else:
        print("No courses were found to save.")

if __name__ == "__main__":
    asyncio.run(main())
