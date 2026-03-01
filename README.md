# Preformative Backend
## Panduan penjalanan
clone repository ini dengan
```
git clone https://github.com/faeiz-ff/preformative-backend
```

masuk ke folder preformative-backend lalu install seluruh _dependency_ dengan npm
```
cd preformative-backend
npm install
```

Backend ini sangat terintegrasi dengan environment cloudflare, untuk mengembangkannya anda harus:
- Buat [akun Cloudflare](https://dash.cloudflare.com/sign-up)
- Buat database D1 melalui dashboard atau jalankan command ini dalam folder
```
npx wrangler d1 create <DB_NAME>
```
- Copy-paste bindings menuju `wrangler.jsonc`, ganti bindings database saya yang saya lupa tutupi
- Lalu inisialisasi database dengan command ini
```
npx wrangler d1 execute <DB-NAME> --file=./schema.sql
```

Jalankan `npm run dev` dan server localhost akan berjalan
