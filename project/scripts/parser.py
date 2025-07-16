import json
import sys
from bs4 import BeautifulSoup

courses = []
try:
    with open('studyfinder.html', 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table')
    
    if table:
        rows = table.find_all('tr')
        for row in rows:
            cells = row.find_all('td')
            if len(cells) >= 5:
                area = cells[0].get_text(strip=True) if cells[0] else ''
                programme = cells[1].get_text(strip=True) if cells[1] else ''
                level = cells[2].get_text(strip=True) if cells[2] else ''
                mode = cells[3].get_text(strip=True) if cells[3] else ''
                university = cells[4].get_text(strip=True) if cells[4] else ''
                
                email = ''
                if len(cells) >= 6 and cells[5]:
                    link = cells[5].find('a')
                    if link and 'href' in link.attrs:
                        email = link['href'].replace('mailto:', '')

                if programme and university:
                    courses.append({
                        'Area': area,
                        'Programme': programme,
                        'Level': level,
                        'Mode': mode,
                        'University': university,
                        'Email': email
                    })

except Exception as e:
    print(f"An error occurred: {e}", file=sys.stderr)

with open('courses_scraped.json', 'w', encoding='utf-8') as f:
    json.dump(courses, f, ensure_ascii=False, indent=2)

print(f"Successfully parsed {len(courses)} courses.")
