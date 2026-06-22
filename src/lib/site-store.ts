import { useSyncExternalStore } from "react";
import type { SiteData, Product, BlogPost, Consultation, SiteSettings } from "./types";

import heroVideo from "../assets/hero-loop.mp4.asset.json";
import imgGiocha from "../assets/product-giocha.jpg";
import imgChalua from "../assets/product-chalua.jpg";
import imgChaque from "../assets/product-chaque.jpg";
import imgNemchua from "../assets/product-nemchua.jpg";
import imgGiavi from "../assets/product-giavi.jpg";
import imgMamtom from "../assets/product-mamtom.jpg";

const STORAGE_KEY = "giahung_site_v2";

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: "GIA HƯNG",
  heroEyebrow: "Thương hiệu gia vị Việt cao cấp",
  heroTitleLine1: "Hương vị đậm đà,",
  heroTitleLine2: "chuẩn vị Việt.",
  heroDescription:
    "Gia Hưng — chuyên cung cấp gia vị nem chua, giò chả và đặc sản từ nguyên liệu chọn lọc. Đậm vị, sạch, an toàn — giao toàn quốc.",
  hotlineDisplay: "0987 654 321",
  hotlineTel: "0987654321",
  workingHours: "8:00 — 21:00 mỗi ngày",
  zaloUrl: "https://zalo.me/0987654321",
  messengerUrl: "https://m.me/",
  address: "Số 1, Phố Hàng Buồm, Hà Nội",
  email: "lienhe@giahung.vn",
  facebookUrl: "https://facebook.com/",
  footerNote: "© Gia Hưng. Tất cả các quyền được bảo lưu.",
  heroVideoUrl: heroVideo.url,
};

const DEFAULT_PRODUCTS: Product[] = [
  { id: "p1", slug: "gio-cha", name: "Giò chả truyền thống", image: imgGiocha, tag: "Bán chạy", price: "120.000đ", weight: "500g", shortDesc: "Giò chả dẻo dai, thơm vị tiêu và mắm cốt.", longDesc: "Giò chả Gia Hưng được làm thủ công từ thịt heo nóng chọn lọc trong ngày, quết tay theo công thức gia truyền. Hương vị đậm đà, dẻo dai tự nhiên, không hàn the, không chất bảo quản.", order: 1 },
  { id: "p2", slug: "cha-lua", name: "Chả lụa Bắc bộ", image: imgChalua, tag: "Mới", price: "150.000đ", weight: "500g", shortDesc: "Chả lụa mịn, giòn nhẹ, gói lá chuối xanh.", longDesc: "Chả lụa gói trong lá chuối tươi, hấp chín tới giữ trọn vị ngọt thịt, mặt cắt mịn — đặc trưng món Bắc bộ truyền thống.", order: 2 },
  { id: "p3", slug: "cha-que", name: "Chả quế đặc biệt", image: imgChaque, tag: null, price: "180.000đ", weight: "500g", shortDesc: "Quế Trà My nguyên cây, vị ấm, ngọt hậu.", longDesc: "Chả quế làm từ quế Trà My nguyên cây, nướng than hoa cho lớp vỏ vàng cánh gián, vị quế ấm và ngọt hậu rất riêng.", order: 3 },
  { id: "p4", slug: "nem-chua", name: "Nem chua Thanh Hoá", image: imgNemchua, tag: "Đặc sản", price: "90.000đ", weight: "20 chiếc", shortDesc: "Nem chua chua dịu, gói lá ổi truyền thống.", longDesc: "Nem chua Thanh Hoá lên men tự nhiên 2-3 ngày, vị chua dịu, gói lá ổi và lá chuối. Thưởng thức cùng tỏi ớt là tuyệt nhất.", order: 4 },
  { id: "p5", slug: "gia-vi-nem", name: "Gia vị nem chua", image: imgGiavi, tag: "Best seller", price: "55.000đ", weight: "200g", shortDesc: "Hỗn hợp gia vị chuẩn vị làng nghề.", longDesc: "Bộ gia vị trộn nem chua chuẩn tỉ lệ làng nghề — chỉ cần trộn cùng thịt nạc xay là có nem chua đúng vị, không phụ gia hoá học.", order: 5 },
  { id: "p6", slug: "mam-tom", name: "Mắm tôm Hậu Lộc", image: imgMamtom, tag: "Gia truyền", price: "75.000đ", weight: "350g", shortDesc: "Mắm tôm sánh đặc, dậy mùi đặc trưng.", longDesc: "Mắm tôm Hậu Lộc ủ truyền thống, sánh đặc, dậy mùi đặc trưng. Đánh cùng chanh đường ăn với bún đậu là chuẩn vị.", order: 6 },
];

const DEFAULT_BLOG: BlogPost[] = [
  {
    id: "b1",
    slug: "bi-quyet-tron-nem-chua",
    title: "Bí quyết trộn nem chua đậm vị tại nhà",
    cover: imgGiavi,
    excerpt: "Chỉ với gói gia vị Gia Hưng và vài bước đơn giản, bạn đã có mẻ nem chua chuẩn vị làng nghề.",
    content: "Nguyên liệu: 500g thịt nạc xay, 100g bì heo, 1 gói gia vị Gia Hưng.\n\nCách làm: Trộn đều thịt với gia vị, để 15 phút cho thấm. Vo viên, gói lá ổi và lá chuối. Ủ nơi thoáng 2-3 ngày là dùng được.\n\nMẹo: Thêm 1 thìa nước mắm cốt và vài lát tỏi để tăng hương vị.",
    date: "2026-06-01",
  },
];

const DEFAULTS: SiteData = {
  settings: DEFAULT_SETTINGS,
  products: DEFAULT_PRODUCTS,
  blog: DEFAULT_BLOG,
  consultations: [],
};

let memory: SiteData = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

function load(): SiteData {
  if (typeof window === "undefined") return DEFAULTS;
  if (loaded) return memory;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteData>;
      memory = {
        settings: { ...DEFAULTS.settings, ...(parsed.settings || {}) },
        products: parsed.products?.length ? parsed.products : DEFAULTS.products,
        blog: parsed.blog ?? DEFAULTS.blog,
        consultations: parsed.consultations ?? [],
      };
    } else {
      memory = DEFAULTS;
    }
  } catch {
    memory = DEFAULTS;
  }
  loaded = true;
  return memory;
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch (e) {
    console.warn("Failed to persist site data", e);
  }
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      loaded = false;
      load();
      listeners.forEach((l) => l());
    }
  });
}

export function getSiteData(): SiteData {
  return load();
}

export function setSiteData(updater: (d: SiteData) => SiteData) {
  memory = updater(load());
  persist();
}

export function useSiteData(): SiteData {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => load(),
    () => DEFAULTS,
  );
}

// Mutations ----------------------------------------------------------------

export function updateSettings(patch: Partial<SiteSettings>) {
  setSiteData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
}

export function upsertProduct(p: Product) {
  setSiteData((d) => {
    const idx = d.products.findIndex((x) => x.id === p.id);
    const list = [...d.products];
    if (idx >= 0) list[idx] = p;
    else list.push(p);
    return { ...d, products: list };
  });
}

export function deleteProduct(id: string) {
  setSiteData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
}

export function moveProduct(id: string, dir: -1 | 1) {
  setSiteData((d) => {
    const list = [...d.products];
    const i = list.findIndex((p) => p.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return d;
    [list[i], list[j]] = [list[j], list[i]];
    return { ...d, products: list };
  });
}

export function upsertBlog(b: BlogPost) {
  setSiteData((d) => {
    const idx = d.blog.findIndex((x) => x.id === b.id);
    const list = [...d.blog];
    if (idx >= 0) list[idx] = b;
    else list.unshift(b);
    return { ...d, blog: list };
  });
}

export function deleteBlog(id: string) {
  setSiteData((d) => ({ ...d, blog: d.blog.filter((b) => b.id !== id) }));
}

export function addConsultation(c: Omit<Consultation, "id" | "createdAt" | "handled">) {
  const item: Consultation = {
    id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    handled: false,
    ...c,
  };
  setSiteData((d) => ({ ...d, consultations: [item, ...d.consultations] }));
}

export function toggleConsultation(id: string) {
  setSiteData((d) => ({
    ...d,
    consultations: d.consultations.map((c) =>
      c.id === id ? { ...c, handled: !c.handled } : c,
    ),
  }));
}

export function deleteConsultation(id: string) {
  setSiteData((d) => ({ ...d, consultations: d.consultations.filter((c) => c.id !== id) }));
}

export function resetSiteData() {
  memory = DEFAULTS;
  persist();
}

export function exportSiteData(): string {
  return JSON.stringify(load(), null, 2);
}

export function importSiteData(json: string) {
  const parsed = JSON.parse(json) as SiteData;
  memory = {
    settings: { ...DEFAULTS.settings, ...parsed.settings },
    products: parsed.products ?? [],
    blog: parsed.blog ?? [],
    consultations: parsed.consultations ?? [],
  };
  persist();
}

// Admin gate ---------------------------------------------------------------

const ADMIN_KEY = "giahung_admin";
export const ADMIN_CODE = "BINH2008";

export function isAdmin(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_KEY) === "1";
}

export function setAdmin(v: boolean) {
  if (typeof window === "undefined") return;
  if (v) window.localStorage.setItem(ADMIN_KEY, "1");
  else window.localStorage.removeItem(ADMIN_KEY);
}