import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const text = readFileSync(join(root, ".env.local"), "utf8");
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const idx = line.indexOf("=");
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[line.slice(0, idx).trim()] = value;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
const password = process.env.DB_PASSWORD;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
  process.exit(1);
}
if (!password) {
  console.error("Missing DB_PASSWORD");
  process.exit(1);
}

const ref = new URL(url).hostname.split(".")[0];
const ssl = { rejectUnauthorized: false };

const targets = [
  { host: `db.${ref}.supabase.co`, port: 5432, user: "postgres" },
  { host: `db.${ref}.supabase.co`, port: 6543, user: "postgres" },
  ...[
    "aws-0-eu-central-1",
    "aws-0-eu-west-1",
    "aws-0-eu-west-2",
    "aws-0-us-east-1",
    "aws-1-us-east-1",
    "aws-0-us-west-1",
    "aws-0-ap-southeast-1",
  ].flatMap((region) => [
    { host: `${region}.pooler.supabase.com`, port: 6543, user: `postgres.${ref}` },
    { host: `${region}.pooler.supabase.com`, port: 5432, user: `postgres.${ref}` },
  ]),
];

async function connect() {
  let lastError = "none";
  for (const target of targets) {
    const client = new pg.Client({
      host: target.host,
      port: target.port,
      user: target.user,
      password,
      database: "postgres",
      ssl,
      connectionTimeoutMillis: 8000,
    });
    try {
      await client.connect();
      console.log(`connected ${target.host}:${target.port}`);
      return client;
    } catch (error) {
      lastError = error.code || error.message || "fail";
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  console.error("Could not connect to Postgres:", lastError);
  process.exit(1);
}

const db = await connect();
await db.query(readFileSync(join(root, "supabase/schema.sql"), "utf8"));
await db.query("notify pgrst, 'reload schema'");
console.log("schema applied");

await db.query("delete from public.products");
await db.query("delete from public.categories where parent_id is not null");
await db.query("delete from public.categories");

const categories = [
  { name: "accessories", name_ar: "إكسسوارات", slug: "accessories", subtitle: "Grips, bands & extras", subtitle_ar: "قبضة وأشرطة وإضافات", image: "/theme/collection-accessories.jpg", sort_order: 1 },
  { name: "Rackets", name_ar: "مضارب", slug: "rackets", subtitle: "Own the court", subtitle_ar: "امتلك الملعب", image: "/theme/collection-rackets.jpg", sort_order: 2 },
  { name: "clothes", name_ar: "ملابس", slug: "clothes", subtitle: "Court-ready kit", subtitle_ar: "ملابس جاهزة للملعب", image: "/theme/collection-clothes.jpg", sort_order: 3 },
  { name: "tools", name_ar: "أدوات", slug: "tools", subtitle: "Bags & court gear", subtitle_ar: "حقائب ومعدات الملعب", image: "/theme/collection-tools.jpg", sort_order: 4 },
];

const products = [
  {
    name: "The Oryx Padel Racket",
    name_ar: "مضرب أوريكس للبادل",
    slug: "the-oryx-padel-racket",
    description: "Made with care and unconditionally loved by our customers, this signature bestseller exceeds all expectations.",
    description_ar: "صُنع بعناية ويحظى بحب عملائنا بلا قيد، هذا المنتج الأيقوني يتجاوز كل التوقعات.",
    category: "Rackets",
    category_slug: "rackets",
    price: 890,
    compare_at_price: null,
    badge: "BESTSELLER",
    images: ["/theme/bestseller.jpg", "/theme/collection-rackets.jpg"],
    sku: "OX-RK-001",
    sizes: [],
    colors: ["Black / Gold"],
    stock: 18,
    status: "active",
    created_at: "2026-09-12T10:00:00.000Z",
  },
  {
    name: "Oryx Pro Carbon Racket",
    name_ar: "مضرب أوريكس برو كاربون",
    slug: "oryx-pro-carbon-racket",
    description: "A stiffer carbon face for players who want extra power without giving up control on the glass.",
    description_ar: "وجه كاربون أكثر صلابة للاعبين الذين يريدون قوة إضافية دون التخلي عن التحكم.",
    category: "Rackets",
    category_slug: "rackets",
    price: 1190,
    compare_at_price: 1390,
    badge: "SALE",
    images: ["/theme/collection-rackets.jpg", "/theme/bestseller.jpg"],
    sku: "OX-RK-002",
    sizes: [],
    colors: ["Black"],
    stock: 9,
    status: "active",
    created_at: "2026-09-10T10:00:00.000Z",
  },
  {
    name: "Oryx Control Racket",
    name_ar: "مضرب أوريكس للتحكم",
    slug: "oryx-control-racket",
    description: "A rounder sweet spot and softer core for placement, defense, and long rallies.",
    description_ar: "نقطة ضرب أوسع وقلب أكثر ليونة للتموضع والدفاع والراليات الطويلة.",
    category: "Rackets",
    category_slug: "rackets",
    price: 790,
    compare_at_price: null,
    badge: "NEW",
    images: ["/theme/hero.jpg", "/theme/collection-rackets.jpg"],
    sku: "OX-RK-003",
    sizes: [],
    colors: ["Navy"],
    stock: 14,
    status: "active",
    created_at: "2026-09-14T10:00:00.000Z",
  },
  {
    name: "Oryx Wristband Set",
    name_ar: "طقم أساور أوريكس",
    slug: "oryx-wristband-set",
    description: "Absorbent court wristbands with superior moisture control so you can stay locked on the point.",
    description_ar: "أساور ملعب ماصة برطوبة فائقة التحكم لتبقى مركّزاً على النقطة.",
    category: "accessories",
    category_slug: "accessories",
    price: 45,
    compare_at_price: null,
    badge: "NEW",
    images: ["/theme/collection-accessories.jpg"],
    sku: "OX-AC-001",
    sizes: ["One size"],
    colors: ["Black", "White"],
    stock: 40,
    status: "active",
    created_at: "2026-09-08T10:00:00.000Z",
  },
  {
    name: "Oryx Overgrip Pack",
    name_ar: "عبوة أوفرغريب أوريكس",
    slug: "oryx-overgrip-pack",
    description: "A three-pack of tacky overgrips that stay dry through intense play.",
    description_ar: "عبوة من ثلاث طبقات قبضة لزجة تبقى جافة خلال اللعب المكثف.",
    category: "accessories",
    category_slug: "accessories",
    price: 35,
    compare_at_price: 49,
    badge: "SALE",
    images: ["/theme/collection-accessories.jpg", "/theme/collection-tools.jpg"],
    sku: "OX-AC-002",
    sizes: [],
    colors: ["White", "Black"],
    stock: 60,
    status: "active",
    created_at: "2026-09-05T10:00:00.000Z",
  },
  {
    name: "Oryx Padel Balls",
    name_ar: "كرات بادل أوريكس",
    slug: "oryx-padel-balls",
    description: "Pressurized padel balls built for consistent bounce on Gulf courts.",
    description_ar: "كرات بادل مضغوطة بقفازة ثابتة على ملاعب الخليج.",
    category: "accessories",
    category_slug: "accessories",
    price: 55,
    compare_at_price: null,
    badge: null,
    images: ["/theme/hero.jpg"],
    sku: "OX-AC-003",
    sizes: [],
    colors: ["Yellow"],
    stock: 80,
    status: "active",
    created_at: "2026-08-28T10:00:00.000Z",
  },
  {
    name: "Oryx Court Tee",
    name_ar: "تيشيرت ملعب أوريكس",
    slug: "oryx-court-tee",
    description: "A light performance tee that stands up to intense play while keeping you dry.",
    description_ar: "تيشيرت خفيف للأداء يصمد أمام اللعب المكثف ويبقيك جافاً.",
    category: "clothes",
    category_slug: "clothes",
    price: 149,
    compare_at_price: null,
    badge: "NEW",
    images: ["/theme/collection-clothes.jpg"],
    sku: "OX-CL-001",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black"],
    stock: 28,
    status: "active",
    created_at: "2026-09-11T10:00:00.000Z",
  },
  {
    name: "Oryx Training Shorts",
    name_ar: "شورت تدريب أوريكس",
    slug: "oryx-training-shorts",
    description: "Stretch shorts with a secure pocket and a cut that moves from warm-up to match.",
    description_ar: "شورت مطاطي بجيب آمن وقصة تنتقل من الإحماء إلى المباراة.",
    category: "clothes",
    category_slug: "clothes",
    price: 129,
    compare_at_price: 169,
    badge: "SALE",
    images: ["/theme/collection-clothes.jpg", "/theme/collection-tools.jpg"],
    sku: "OX-CL-002",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy"],
    stock: 22,
    status: "active",
    created_at: "2026-09-03T10:00:00.000Z",
  },
  {
    name: "Oryx Club Hoodie",
    name_ar: "هودي نادي أوريكس",
    slug: "oryx-club-hoodie",
    description: "A heavyweight hoodie for before and after the match, finished with the Oryx mark.",
    description_ar: "هودي ثقيل قبل المباراة وبعدها بشعار أوريكس.",
    category: "clothes",
    category_slug: "clothes",
    price: 289,
    compare_at_price: null,
    badge: "TRENDING",
    images: ["/theme/collection-clothes.jpg"],
    sku: "OX-CL-003",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "Sand"],
    stock: 12,
    status: "active",
    created_at: "2026-08-20T10:00:00.000Z",
  },
  {
    name: "Oryx Court Bag",
    name_ar: "حقيبة ملعب أوريكس",
    slug: "oryx-court-bag",
    description: "A padded racket bag with space for shoes, grips, and a change of kit.",
    description_ar: "حقيبة مضرب مبطنة تتسع للحذاء والقبضة وملابس بديلة.",
    category: "tools",
    category_slug: "tools",
    price: 349,
    compare_at_price: null,
    badge: "BESTSELLER",
    images: ["/theme/collection-tools.jpg"],
    sku: "OX-TL-001",
    sizes: [],
    colors: ["Black"],
    stock: 15,
    status: "active",
    created_at: "2026-09-09T10:00:00.000Z",
  },
  {
    name: "Oryx Bumper Guard",
    name_ar: "واقي إطار أوريكس",
    slug: "oryx-bumper-guard",
    description: "A replaceable bumper that protects the racket frame on glass and turf.",
    description_ar: "واقي قابل للاستبدال يحمي إطار المضرب على الزجاج والعشب.",
    category: "tools",
    category_slug: "tools",
    price: 39,
    compare_at_price: null,
    badge: null,
    images: ["/theme/collection-tools.jpg", "/theme/collection-rackets.jpg"],
    sku: "OX-TL-002",
    sizes: [],
    colors: ["Black"],
    stock: 50,
    status: "active",
    created_at: "2026-08-16T10:00:00.000Z",
  },
  {
    name: "Oryx Stringing Kit",
    name_ar: "طقم شد أوتار أوريكس",
    slug: "oryx-stringing-kit",
    description: "Court-side stringing essentials to keep tension consistent through the season.",
    description_ar: "أساسيات شد الأوتار للحفاظ على توتر ثابت طوال الموسم.",
    category: "tools",
    category_slug: "tools",
    price: 95,
    compare_at_price: null,
    badge: "NEW",
    images: ["/theme/collection-tools.jpg"],
    sku: "OX-TL-003",
    sizes: [],
    colors: ["Black"],
    stock: 20,
    status: "active",
    created_at: "2026-09-13T10:00:00.000Z",
  },
];

for (const row of categories) {
  await db.query(
    `insert into public.categories (name, name_ar, slug, subtitle, subtitle_ar, image, sort_order)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (slug) do update set
       name = excluded.name,
       name_ar = excluded.name_ar,
       subtitle = excluded.subtitle,
       subtitle_ar = excluded.subtitle_ar,
       image = excluded.image,
       sort_order = excluded.sort_order`,
    [row.name, row.name_ar, row.slug, row.subtitle, row.subtitle_ar, row.image, row.sort_order],
  );
}

for (const row of products) {
  await db.query(
    `insert into public.products (
       name, name_ar, slug, description, description_ar, category, category_slug, price, compare_at_price, badge,
       images, sku, sizes, colors, stock, status, created_at
     ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
     on conflict (slug) do update set
       name = excluded.name,
       name_ar = excluded.name_ar,
       description = excluded.description,
       description_ar = excluded.description_ar,
       category = excluded.category,
       category_slug = excluded.category_slug,
       price = excluded.price,
       compare_at_price = excluded.compare_at_price,
       badge = excluded.badge,
       images = excluded.images,
       sku = excluded.sku,
       sizes = excluded.sizes,
       colors = excluded.colors,
       stock = excluded.stock,
       status = excluded.status`,
    [
      row.name,
      row.name_ar,
      row.slug,
      row.description,
      row.description_ar,
      row.category,
      row.category_slug,
      row.price,
      row.compare_at_price,
      row.badge,
      row.images,
      row.sku,
      row.sizes,
      row.colors,
      row.stock,
      row.status,
      row.created_at,
    ],
  );
}

await db.query(
  `insert into public.store_settings (id, free_shipping_from, shipping_fee, return_days, promo_code, promo_percent)
   values ('store', 500, 25, 14, 'OX25', 25)
   on conflict (id) do update set
     promo_code = excluded.promo_code,
     promo_percent = excluded.promo_percent`,
);

const counts = await db.query(
  `select 'categories' as name, count(*)::int as n from public.categories
   union all select 'products', count(*)::int from public.products
   union all select 'customers', count(*)::int from public.customers
   union all select 'orders', count(*)::int from public.orders
   union all select 'newsletter', count(*)::int from public.newsletter
   order by 1`,
);
await db.end();
console.log("catalogue upserted");
console.log(counts.rows.map((row) => `${row.name}:${row.n}`).join(" "));

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      headers.set("apikey", key);
      if (key.startsWith("sb_publishable_") || key.startsWith("sb_secret_")) {
        headers.delete("Authorization");
      }
      return fetch(input, { ...init, headers });
    },
  },
});

await new Promise((resolve) => setTimeout(resolve, 1500));
const { error } = await sb.from("products").select("id").limit(1);
if (error) console.log("api still warming:", error.code || error.message);
else console.log("api ready");
