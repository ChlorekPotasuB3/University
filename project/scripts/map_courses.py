import json
import re

# A simple fuzzy matching function
def fuzzy_match(name1, name2):
    # Normalize strings: lowercase, remove punctuation and common terms
    def normalize(s):
        s = s.lower()
        s = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()]', '', s)
        s = re.sub(r'\b(university|of|and|in|technology|science|sciences|school|politechnika|uniwersytet|agh)\b', '', s)
        return s.strip().replace(" ", "")

    n1 = normalize(name1)
    n2 = normalize(name2)
    
    # Simple substring check for high confidence
    return n1 in n2 or n2 in n1


def main():
    # Load the static university data
    try:
        with open('assets/data/universities.json', 'r', encoding='utf-8') as f:
            universities = json.load(f)
    except FileNotFoundError:
        print("Error: 'assets/data/universities.json' not found. Make sure you are running this script from the 'project' directory.")
        return

    # Load the scraped courses
    try:
        with open('courses.json', 'r', encoding='utf-8') as f:
            scraped_courses = json.load(f)
    except FileNotFoundError:
        print("Error: 'courses.json' not found. Make sure the scraped data file exists in the 'project' directory.")
        return

    # Create a mapping from university name to ID
    uni_name_to_id = {uni['name']: uni['id'] for uni in universities}
    
    updated_courses = []
    unmatched_institutions = set()
    matched_count = 0

    for course in scraped_courses:
        institution_name = course.get('institution', {}).get('title')
        if not institution_name:
            continue

        matched_id = None
        for uni_name, uni_id in uni_name_to_id.items():
            if fuzzy_match(institution_name, uni_name):
                matched_id = uni_id
                break
        
        if matched_id:
            course['universityId'] = matched_id
            updated_courses.append(course)
            matched_count += 1
        else:
            unmatched_institutions.add(institution_name)

    # The app's DataService expects an object with a "courses" key
    final_data = {"courses": updated_courses}

    # Save the updated, mapped courses to the assets directory
    output_path = 'assets/data/courses.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, indent=2, ensure_ascii=False)

    print(f"Script finished.")
    print(f"Successfully matched and mapped {matched_count} courses.")
    print(f"The updated data has been saved to '{output_path}'.")

    if unmatched_institutions:
        print("\nCould not find a match for the following institutions:")
        for name in sorted(list(unmatched_institutions)):
            print(f"- {name}")

if __name__ == '__main__':
    main()
