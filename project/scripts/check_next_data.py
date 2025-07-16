import os

file_path = 'educations_complete.html'

if not os.path.exists(file_path):
    print(f"Error: File not found at {os.path.abspath(file_path)}")
else:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        if '__NEXT_DATA__' in content:
            print("Success: '__NEXT_DATA__' found in the file.")
        else:
            print("Failure: '__NEXT_DATA__' not found in the file.")
