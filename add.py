import json
import requests
from random import randrange

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
    "content type": 'form-data'
}


brands = []

get_brands = requests.get(
    "http://localhost:8000/api/v1/brands?limit=20", headers=headers)

for brand in get_brands.json()["data"]:
    brands.append(brand["_id"])

subcategories = {
    "Men": {
        "id": "646e3bddee42ea096a3d9815",
        "subcategories": {}
    },
    "Women": {
        "id": "646e3bebee42ea096a3d9817",
        "subcategories": {}
    }
}

get_subcategories = requests.get(
    "http://localhost:8000/api/v1/subcategories?limit=20", headers=headers)


for subcategory in get_subcategories.json()["data"]:
    category = subcategory['category']['name']
    subcategories[category]["subcategories"][subcategory['name']
                                             ] = subcategory['_id']

    # print(subcategory['name'] + " " + subcategory['category']['name'])

#----------------------------------------------------------------------------------------------------------#

ref = {
    'name': 'new product',
    'description': 'This is a new product',
    'brand': '646e4bc85f4f3048be1dab12',
    'category': '646e3bebee42ea096a3d9817',
    'subCategory': '646e3ed2ee42ea096a3d9852',
    'currentPrice': 50,
    'discountedPrice': 40,
    # "variants": [
    #         {
    #             "color": "blue",
    #             "variantImage": "sdfdsfsd",
    #             "variantImages": ["dfsddfds", "Sdfsdf"],
    #             "sizes":[
    #                 {
    #                     "name": "S",
    #                     "quantity": 5
    #                 }
    #             ]
    #         }
    # ]
}

with open("D:\\merchant_db\\Bershka\\bershka_stock.json", 'r') as openfile:

    products = json.load(openfile)

for p in range(100):
    r = randrange(len(products))  # random product
    b = randrange(len(brands))  # random brand

    brand_id = brands[b]

    category = subcategories[products[r]['item_section']]
    category_id = category['id']

    subcategory_id = category['subcategories'][products[r]['item_category']]

    data = {
        'name': products[r]['item_name'],
        'description': products[r]['item_description'],
        'brand': brands[b],
        'category': category_id,
        'subCategory': subcategory_id,
        'currentPrice': products[r]['item_old_price'],
        'discountedPrice': products[r]['item_new_price'] - 100 if products[r]['item_new_price'] == products[r]['item_old_price'] else products[r]['item_new_price'],
    }

    variants = []

    for option in products[r]['item_options']:
        variant = {
            'color': option['color'],
            'variantImage': option['color_image'],
            'variantImages': option['images']
        }

        sizes = []

        for size in option['sizes']:
            size = {
                'name': size['name'],
                'quantity': randrange(20)
            }
            sizes.append(size)

        variant['sizes'] = sizes

        variants.append(variant)
    data['variants'] = variants

    create_product = requests.post(
        "http://localhost:8000/api/v1/products", json=data, headers=headers)

    print(create_product.status_code)
    if(create_product.status_code != 201):
        print(create_product.json())
    

json_object = json.dumps(data, indent=4)

with open("sample.json", "w") as outfile:
    outfile.write(data)
