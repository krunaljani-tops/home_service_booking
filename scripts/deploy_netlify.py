import os
import sys
import io
import zipfile
import requests

NETLIFY_API = "https://api.netlify.com/api/v1"

def create_zip_stream(folder_path):
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for root, _, files in os.walk(folder_path):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, folder_path)
                zip_file.write(full_path, rel_path)
    zip_buffer.seek(0)
    return zip_buffer.getvalue()

def deploy(token: str, site_name: str = "homeserve-platform"):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/zip",
    }
    
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
    if not os.path.exists(dist_dir):
        print(f"Error: {dist_dir} does not exist. Run 'npm run build' first.")
        return

    print(f"Packaging {dist_dir} into zip buffer...")
    zip_bytes = create_zip_stream(dist_dir)
    print(f"Zip created ({len(zip_bytes)} bytes). Deploying to Netlify...")

    # Check or create site
    res = requests.post(
        f"{NETLIFY_API}/sites",
        headers=headers,
        data=zip_bytes,
    )

    if res.status_code in [200, 201]:
        data = res.json()
        print(f"SUCCESSFULLY DEPLOYED TO NETLIFY!")
        print(f"Site Name: {data.get('name')}")
        print(f"Live URL: {data.get('ssl_url') or data.get('url')}")
        print(f"Admin URL: {data.get('admin_url')}")
    else:
        print(f"Deployment failed ({res.status_code}): {res.text}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python deploy_netlify.py <NETLIFY_AUTH_TOKEN>")
    else:
        deploy(sys.argv[1])

