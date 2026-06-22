import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Phone, MessageCircle, ShoppingBag, Leaf, ShieldCheck, Truck, Award,
  PlayCircle, CalendarCheck, Send, Menu, X, MapPin, Mail, Facebook, Lock,
  ArrowRight, Sparkles, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import heroPoster from "../assets/hero-poster.jpg";
import {
  useSiteData, addConsultation, ADMIN_CODE, setAdmin,
} from "../lib/site-store";
import type { Product, BlogPost } from "../lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";

const FEATURES = [
  { icon: Leaf, title: "Nguyên liệu chọn lọc", desc: "Thịt tươi trong ngày, gia vị từ vùng nguyên liệu uy tín." },
  { icon: ShieldCheck, title: "An toàn vệ sinh", desc: "Quy trình khép kín, đạt chuẩn ATTP, kiểm định nghiêm ngặt." },
  { icon: Award, title: "Công thức gia truyền", desc: "Bí quyết được gìn giữ qua nhiều thế hệ làng nghề." },
  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Đóng gói hút chân không, giao nhanh, giữ trọn hương vị." },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gia Hưng — Gia vị nem chua, giò chả chuẩn vị Việt" },
      { name: "description", content: "Gia Hưng — gia vị nem chua, giò chả cao cấp. Nguyên liệu chọn lọc, công thức gia truyền, giao toàn quốc." },
      { property: "og:title", content: "Gia Hưng — Hương vị đậm đà, chuẩn vị Việt" },
      { property: "og:description", content: "Gia vị nem chua, giò chả và đặc sản Gia Hưng." },
      { property: "og:image", content: heroPoster },
      { name: "twitter:image", content: heroPoster },
    ],
  }),
  component: Index,
});

function Index() {
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [openBlog, setOpenBlog] = useState<BlogPost | null>(null);
  return (
    <div className="min-h-screen bg-background font-sans text-foreground" style={{ fontFamily: '"Be Vietnam Pro", system-ui, sans-serif' }}>
      <Header />
      <Hero />
      <Features />
      <Products onOpen={setOpenProduct} />
      <BlogSection onOpen={setOpenBlog} />
      <Consultation />
      <Footer />
      <FloatingChat />
      <ProductDialog product={openProduct} onClose={() => setOpenProduct(null)} />
      <BlogDialog post={openBlog} onClose={() => setOpenBlog(null)} />
    </div>
  );
}

// ----- Header -----
function Header() {
  const { settings } = useSiteData();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navClass = scrolled
    ? "bg-background/90 text-foreground shadow-[0_2px_20px_-10px_rgba(0,0,0,0.2)] backdrop-blur-xl border-b border-border/60"
    : "bg-transparent text-white";

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${navClass}`}>
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-primary-foreground font-bold shadow-lg" style={{ background: "var(--gradient-warm)" }}>
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-lg font-bold tracking-wide sm:text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>
              {settings.brandName}
            </span>
            <span className={`hidden text-[10px] uppercase tracking-[0.2em] sm:block ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>
              Spice & Charcuterie
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium md:flex">
          <a href="#san-pham" className="transition hover:text-primary">Sản phẩm</a>
          <a href="#features" className="transition hover:text-primary">Vì sao chọn</a>
          <a href="#blog" className="transition hover:text-primary">Bài viết</a>
          <a href="#tu-van" className="transition hover:text-primary">Tư vấn</a>
          <a href="#lien-he" className="transition hover:text-primary">Liên hệ</a>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <a
            href={`tel:${settings.hotlineTel}`}
            className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition md:inline-flex ${
              scrolled ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" : "border border-white/40 hover:bg-white hover:text-primary"
            }`}
          >
            <Phone className="h-4 w-4" /> {settings.hotlineDisplay}
          </a>
          <a href={`tel:${settings.hotlineTel}`} aria-label="Gọi hotline" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-md md:hidden">
            <Phone className="h-4 w-4" />
          </a>
          <button type="button" aria-label="Mở menu" onClick={() => setOpen((v) => !v)} className={`grid h-11 w-11 place-items-center rounded-full transition md:hidden ${scrolled ? "bg-muted text-foreground" : "border border-white/40 text-white"}`}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 text-sm font-medium text-foreground">
            {[["Sản phẩm","#san-pham"],["Vì sao chọn","#features"],["Bài viết","#blog"],["Tư vấn","#tu-van"],["Liên hệ","#lien-he"]].map(([label,href])=>(
              <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 hover:bg-muted">{label}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

// ----- Hero with video -----
function Hero() {
  const { settings } = useSiteData();
  return (
    <section id="top" className="relative min-h-[100vh] w-full overflow-hidden">
      <video
        key={settings.heroVideoUrl}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay muted loop playsInline preload="auto"
        poster={heroPoster}
      >
        <source src={settings.heroVideoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/85" />

      <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-7xl flex-col justify-center px-4 pb-24 pt-28 text-white sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] backdrop-blur-sm sm:text-xs sm:tracking-[0.22em]">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> {settings.heroEyebrow}
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl" style={{ fontFamily: '"Playfair Display", serif' }}>
          {settings.heroTitleLine1}
          <br />
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-warm)" }}>{settings.heroTitleLine2}</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm text-white/85 sm:mt-6 sm:text-base md:text-lg">{settings.heroDescription}</p>
        <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <a href="#san-pham" className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-2xl transition hover:-translate-y-0.5 sm:w-auto" style={{ background: "var(--gradient-warm)", boxShadow: "var(--shadow-elegant)" }}>
            <ShoppingBag className="h-4 w-4" /> Khám phá sản phẩm <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
          <a href="#tu-van" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/20 sm:w-auto">
            <PlayCircle className="h-4 w-4" /> Tư vấn miễn phí
          </a>
        </div>

        <div className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-8 sm:mt-16 sm:gap-8">
          <Stat n="30+" label="Năm kinh nghiệm" />
          <Stat n="100%" label="Nguyên liệu sạch" />
          <Stat n="63" label="Tỉnh thành giao hàng" />
        </div>
      </div>
    </section>
  );
}
function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="min-w-0">
      <div className="text-2xl font-bold sm:text-3xl bg-clip-text text-transparent" style={{ fontFamily: '"Playfair Display", serif', backgroundImage: "var(--gradient-warm)" }}>{n}</div>
      <div className="mt-1 text-[11px] leading-snug text-white/70 sm:text-sm">{label}</div>
    </div>
  );
}

// ----- Features -----
function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
      <div className="mb-10 max-w-2xl sm:mb-12">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Vì sao chọn Gia Hưng</span>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ fontFamily: '"Playfair Display", serif' }}>Bốn cam kết giữ trọn hương vị</h2>
      </div>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="group relative overflow-hidden rounded-3xl border border-border/70 bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl sm:p-6">
            <div className="grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground shadow-md transition group-hover:scale-110" style={{ background: "var(--gradient-warm)" }}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-base font-semibold sm:text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ----- Products -----
function Products({ onOpen }: { onOpen: (p: Product) => void }) {
  const { products, settings } = useSiteData();
  const [filter, setFilter] = useState<string>("all");
  const tags = useMemo(() => {
    const s = new Set<string>();
    products.forEach((p) => p.tag && s.add(p.tag));
    return ["all", ...Array.from(s)];
  }, [products]);
  const filtered = filter === "all" ? products : products.filter((p) => p.tag === filter);

  return (
    <section id="san-pham" className="bg-muted/40 py-16 sm:py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end md:gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Sản phẩm</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl" style={{ fontFamily: '"Playfair Display", serif' }}>Bộ sưu tập Gia Hưng</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">Tinh hoa ẩm thực Việt trong từng gói gia vị — chọn sản phẩm và đặt lịch tư vấn cùng nghệ nhân.</p>
          </div>
          <a href={`tel:${settings.hotlineTel}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:scale-[1.02] sm:w-auto">
            <Phone className="h-4 w-4" /> Đặt nhanh: {settings.hotlineDisplay}
          </a>
        </div>

        {tags.length > 2 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${filter === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/40"}`}>
                {t === "all" ? "Tất cả" : t}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
          {filtered.map((p) => (
            <article
              key={p.id}
              onClick={() => onOpen(p)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                {p.tag && (
                  <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md" style={{ background: "var(--gradient-warm)" }}>{p.tag}</span>
                )}
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  Xem chi tiết <ArrowRight className="h-3 w-3" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-lg font-semibold sm:text-xl" style={{ fontFamily: '"Playfair Display", serif' }}>{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.shortDesc}</p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary" style={{ fontFamily: '"Playfair Display", serif' }}>{p.price}</span>
                  <span className="text-xs text-muted-foreground">/ {p.weight}</span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button onClick={(e) => { e.stopPropagation(); onOpen(p); }} className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
                    <ShoppingBag className="h-3.5 w-3.5" /> Chi tiết
                  </button>
                  <a href={`tel:${settings.hotlineTel}`} onClick={(e) => e.stopPropagation()} className="inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                    <Phone className="h-3.5 w-3.5" /> Đặt ngay
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductDialog({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { settings } = useSiteData();
  if (!product) return null;
  const gallery = [product.image, ...(product.gallery ?? [])];
  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden p-0 sm:rounded-3xl">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square w-full bg-muted md:aspect-auto">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            {product.tag && (
              <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow" style={{ background: "var(--gradient-warm)" }}>{product.tag}</span>
            )}
          </div>
          <div className="flex flex-col p-6 sm:p-7">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl sm:text-3xl" style={{ fontFamily: '"Playfair Display", serif' }}>{product.name}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">{product.shortDesc}</DialogDescription>
            </DialogHeader>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary" style={{ fontFamily: '"Playfair Display", serif' }}>{product.price}</span>
              <span className="text-sm text-muted-foreground">/ {product.weight}</span>
            </div>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/80">{product.longDesc || product.shortDesc}</p>
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {gallery.map((g, i) => (
                  <img key={i} src={g} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
                ))}
              </div>
            )}
            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a href={`tel:${settings.hotlineTel}`} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
                <Phone className="h-4 w-4" /> Gọi đặt hàng
              </a>
              <a href={settings.zaloUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground">
                <MessageCircle className="h-4 w-4" /> Chat Zalo
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ----- Blog -----
function BlogSection({ onOpen }: { onOpen: (p: BlogPost) => void }) {
  const { blog } = useSiteData();
  if (!blog.length) return null;
  return (
    <section id="blog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Bài viết</span>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:text-4xl" style={{ fontFamily: '"Playfair Display", serif' }}>Mẹo bếp & câu chuyện làng nghề</h2>
      </div>
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blog.map((b) => (
          <article key={b.id} onClick={() => onOpen(b)} className="group cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={b.cover} alt={b.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3 w-3" /> {new Date(b.date).toLocaleDateString("vi-VN")}
              </div>
              <h3 className="mt-2 text-lg font-semibold leading-snug" style={{ fontFamily: '"Playfair Display", serif' }}>{b.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{b.excerpt}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">Đọc tiếp <ArrowRight className="h-3 w-3" /></span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BlogDialog({ post, onClose }: { post: BlogPost | null; onClose: () => void }) {
  if (!post) return null;
  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:rounded-3xl">
        <img src={post.cover} alt={post.title} className="aspect-[16/9] w-full rounded-xl object-cover" />
        <DialogHeader className="text-left">
          <DialogTitle className="text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>{post.title}</DialogTitle>
          <DialogDescription>{new Date(post.date).toLocaleDateString("vi-VN")}</DialogDescription>
        </DialogHeader>
        <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">{post.content}</div>
      </DialogContent>
    </Dialog>
  );
}

// ----- Consultation -----
const consultationSchema = z.object({
  name: z.string().trim().min(1, "Nhập họ tên").max(100),
  phone: z.string().trim().min(8, "SĐT không hợp lệ").max(20),
  message: z.string().trim().max(500).optional().or(z.literal("")),
});

function Consultation() {
  const { settings } = useSiteData();
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [pending, setPending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = consultationSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
      return;
    }
    setPending(true);
    addConsultation({ ...parsed.data, message: parsed.data.message ?? "" });
    setTimeout(() => {
      setPending(false);
      toast.success("Đã gửi yêu cầu — Gia Hưng sẽ gọi lại sớm");
      setForm({ name: "", phone: "", message: "" });
    }, 400);
  };

  return (
    <section id="tu-van" className="relative overflow-hidden py-16 sm:py-20 md:py-24">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 text-white sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] backdrop-blur-sm sm:text-xs">
            <Phone className="h-3 w-3" /> Dịch vụ tư vấn
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl" style={{ fontFamily: '"Playfair Display", serif' }}>Đặt lịch tư vấn cùng nghệ nhân Gia Hưng</h2>
          <p className="mt-4 max-w-md text-sm text-white/80 md:text-base">Để lại thông tin — chúng tôi gọi lại trong 15 phút, tư vấn miễn phí cách trộn nem chua, chọn giò chả, bảo quản sản phẩm.</p>
          <ul className="mt-6 space-y-2 text-sm text-white/85">
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary" /> {settings.workingHours}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" /> {settings.address}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-secondary" /> {settings.email}</li>
          </ul>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl sm:p-8">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/80">Họ tên</label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A" className="mt-1.5 border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/80">Số điện thoại</label>
              <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="09xxxxxxxx" inputMode="tel" className="mt-1.5 border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-white/80">Nội dung (tuỳ chọn)</label>
              <Textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder="Tôi muốn tư vấn về gia vị nem chua…" rows={3} className="mt-1.5 border-white/30 bg-white/95 text-foreground placeholder:text-muted-foreground" />
            </div>
            <Button type="submit" disabled={pending} className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90" size="lg">
              {pending ? "Đang gửi…" : (<><Send className="mr-2 h-4 w-4" /> Gửi yêu cầu tư vấn</>)}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}

// ----- Footer with admin gate -----
function Footer() {
  const { settings } = useSiteData();
  const [code, setCode] = useState("");

  const tryUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() === ADMIN_CODE) {
      setAdmin(true);
      toast.success("Đã mở khoá quản lý");
      window.location.href = "/admin";
    } else {
      toast.error("Mã không đúng");
      setCode("");
    }
  };

  return (
    <footer id="lien-he" className="border-t border-border/60 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:gap-8 md:py-16 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground font-bold shadow-lg" style={{ background: "var(--gradient-warm)" }}>
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="text-lg font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>{settings.brandName}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/60">Spice & Charcuterie</div>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-sidebar-foreground/75">Gia vị nem chua, giò chả và đặc sản Việt — chuẩn vị, sạch, đến từ làng nghề truyền thống.</p>
          <div className="mt-5 flex gap-3">
            <a href={settings.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full bg-sidebar-accent text-sidebar-foreground transition hover:bg-primary hover:text-primary-foreground">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={settings.zaloUrl} target="_blank" rel="noreferrer" aria-label="Zalo" className="grid h-10 w-10 place-items-center rounded-full bg-sidebar-accent text-sidebar-foreground transition hover:bg-primary hover:text-primary-foreground">
              <MessageCircle className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-sidebar-foreground/90">Liên hệ</h4>
          <ul className="mt-4 space-y-3 text-sm text-sidebar-foreground/80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-secondary" /> <a href={`tel:${settings.hotlineTel}`} className="hover:text-secondary">{settings.hotlineDisplay}</a></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-secondary" /> <a href={`mailto:${settings.email}`} className="hover:text-secondary">{settings.email}</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-secondary" /> {settings.address}</li>
            <li className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 text-secondary" /> {settings.workingHours}</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-sidebar-foreground/90">Mã nhân viên</h4>
          <p className="mt-3 text-xs text-sidebar-foreground/60">Dành cho nhân viên Gia Hưng. Nhập mã để mở bảng quản lý.</p>
          <form onSubmit={tryUnlock} className="mt-3 flex gap-2">
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Nhập mã…" className="border-sidebar-border bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/40" />
            <Button type="submit" size="icon" variant="secondary" aria-label="Mở khoá">
              <Lock className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-sidebar-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-sidebar-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <span>{settings.footerNote}</span>
          <span>Made with ♥ in Việt Nam</span>
        </div>
      </div>
    </footer>
  );
}

// ----- Floating chat -----
function FloatingChat() {
  const { settings } = useSiteData();
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3">
      <a href={settings.zaloUrl} target="_blank" rel="noreferrer" aria-label="Chat Zalo" className="grid h-12 w-12 place-items-center rounded-full bg-[#0068ff] text-white shadow-xl transition hover:scale-110">
        <MessageCircle className="h-5 w-5" />
      </a>
      <a href={`tel:${settings.hotlineTel}`} aria-label="Gọi hotline" className="grid h-12 w-12 place-items-center rounded-full text-primary-foreground shadow-xl transition hover:scale-110 animate-pulse" style={{ background: "var(--gradient-warm)" }}>
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}