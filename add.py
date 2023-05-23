import json
import requests

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0"
}



data = {
    "name": "Women",
    "image": "https://iili.io/HgrAvlp.jpg"
}

res = requests.post(
    "http://localhost:8000/api/v1/subcategories", json=data, headers=headers)

print(res.json())
