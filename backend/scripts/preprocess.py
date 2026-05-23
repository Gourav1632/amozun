import csv
import uuid
import datetime
import argparse
import random
import sys

def generate_uuid(name):
    return str(uuid.uuid5(uuid.NAMESPACE_OID, str(name)))

def main():
    parser = argparse.ArgumentParser(description="Preprocess Amazon UK CSV")
    parser.add_argument("--input", default="amz_uk_processed_data.csv", help="Input CSV file")
    parser.add_argument("--limit", type=int, default=10000, help="Number of rows to process")
    args = parser.parse_args()

    input_file = args.input
    limit = args.limit
    
    categories = {}
    products = []
    product_images = []

    print(f"Reading all rows from {input_file}...")

    now = datetime.datetime.utcnow().isoformat()

    try:
        with open(input_file, mode="r", encoding="utf-8") as infile:
            reader = csv.DictReader(infile)
            all_rows = list(reader)
            
            print(f"Found {len(all_rows)} total rows.")
            
            if len(all_rows) > limit:
                print(f"Sampling {limit} random rows...")
                selected_rows = random.sample(all_rows, limit)
            else:
                selected_rows = all_rows
            
            total = len(selected_rows)
            print(f"Processing {total} rows to generate CSVs...\n")
            
            for i, row in enumerate(selected_rows):
                # Progress indicator
                if i % 100 == 0 or i == total - 1:
                    percent = int((i + 1) / total * 100)
                    sys.stdout.write(f"\rProgress: [{i+1}/{total}] {percent}% complete")
                    sys.stdout.flush()

                asin = row.get("asin", "").strip().replace('\n', ' ').replace('\r', ' ')
                title = row.get("title", "").strip().replace('\n', ' ').replace('\r', ' ')
                # Truncate title to 250 characters to avoid Postgres varchar(255) overflow
                if len(title) > 250:
                    title = title[:247] + "..."
                    
                img_url = row.get("imgUrl", "").strip().replace('\n', '').replace('\r', '')
                price_str = row.get("price", "0").replace(",", "").strip().replace('\n', '').replace('\r', '')
                category_name = row.get("categoryName", "Uncategorized").strip().replace('\n', ' ').replace('\r', ' ')
                
                if not asin or not title:
                    continue
                
                try:
                    price = float(price_str)
                except ValueError:
                    price = 0.0
                
                # Convert to INR by multiplying by 80
                price_inr = round(price * 80, 2)
                mrp_inr = round(price_inr * 1.2, 2)
                stock = random.randint(10, 500)
                
                # Handle Category
                if category_name not in categories:
                    cat_id = generate_uuid(category_name)
                    # For slug, simply lowercase and replace spaces
                    slug = category_name.lower().replace(" ", "-").replace("&", "and").replace(",", "")
                    categories[category_name] = {
                        "id": cat_id,
                        "name": category_name,
                        "slug": slug,
                        "image_url": img_url # Just use the first product's image for the category
                    }
                else:
                    cat_id = categories[category_name]["id"]
                
                # Handle Product
                product_id = generate_uuid(asin)
                products.append({
                    "id": product_id,
                    "name": title,
                    "description": title,
                    "specifications": "",
                    "price": price_inr,
                    "mrp": mrp_inr,
                    "stock": stock,
                    "category_id": cat_id,
                    "created_at": now
                })
                
                # Handle Product Image
                if img_url:
                    img_id = generate_uuid(img_url + asin)
                    product_images.append({
                        "id": img_id,
                        "product_id": product_id,
                        "url": img_url,
                        "display_order": 1,
                        "is_primary": "true"
                    })
                    
        print("\n\nWriting data to output CSV files...")
        
        # Write categories.csv
        with open("categories.csv", mode="w", encoding="utf-8", newline="") as catfile:
            writer = csv.DictWriter(catfile, fieldnames=["id", "name", "slug", "image_url"])
            writer.writeheader()
            for cat in categories.values():
                writer.writerow(cat)
                
        # Write products.csv
        with open("products.csv", mode="w", encoding="utf-8", newline="") as prodfile:
            writer = csv.DictWriter(prodfile, fieldnames=["id", "name", "description", "specifications", "price", "mrp", "stock", "category_id", "created_at"])
            writer.writeheader()
            for prod in products:
                writer.writerow(prod)
                
        # Write product_images.csv
        with open("product_images.csv", mode="w", encoding="utf-8", newline="") as imgfile:
            writer = csv.DictWriter(imgfile, fieldnames=["id", "product_id", "url", "display_order", "is_primary"])
            writer.writeheader()
            for img in product_images:
                writer.writerow(img)
                
        print(f"\nSuccessfully created:")
        print(f" - categories.csv ({len(categories)} rows)")
        print(f" - products.csv ({len(products)} rows)")
        print(f" - product_images.csv ({len(product_images)} rows)")
        
    except Exception as e:
        print(f"\nError processing CSV: {e}")

if __name__ == "__main__":
    main()
