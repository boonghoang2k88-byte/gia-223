import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  LogOut, Plus, Trash2, ArrowUp, ArrowDown, Save, Upload, Download,
  RefreshCw, Image as ImageIcon, Video, Newspaper, Package, Settings as Cog,
  Inbox, CheckCircle2, AlertTriangle,
} from "lucide-react";

import {
  useSiteData, isAdmin, setAdmin, updateSettings,
  upsertProduct, deleteProduct, moveProduct,
  upsertBlog, deleteBlog,
  toggleConsultation, deleteConsultation,
  exportSiteData, importSiteData, resetSiteData,
} from "../lib/site-store";
import type { Product, BlogPost, SiteSettings } from "../lib/types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Quản lý — Gia Hưng" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!isAdmin()) navigate({ to: "/" });
    else setReady(true);
  }, [navigate]);
  if (!ready) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>Bảng điều khiển Gia Hưng</h1>
            <p className="text-xs text-muted-foreground">Lưu trên thiết bị này (localStorage). Dùng Sao lưu để chuyển sang máy khác.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setAdmin(false); navigate({ to: "/" }); }}>
            <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Mã <strong>BINH2008</strong> chỉ là lớp ẩn UI. Bất kỳ ai biết mã đều có thể vào trang này.</span>
        </div>
        <Tabs defaultValue="products">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1">
            <TabsTrigger value="products"><Package className="mr-1.5 h-4 w-4" />Sản phẩm</TabsTrigger>
            <TabsTrigger value="blog"><Newspaper className="mr-1.5 h-4 w-4" />Bài viết</TabsTrigger>
            <TabsTrigger value="settings"><Cog className="mr-1.5 h-4 w-4" />Thông tin web</TabsTrigger>
            <TabsTrigger value="hero"><Video className="mr-1.5 h-4 w-4" />Video hero</TabsTrigger>
            <TabsTrigger value="inbox"><Inbox className="mr-1.5 h-4 w-4" />Tư vấn</TabsTrigger>
            <TabsTrigger value="backup"><Save className="mr-1.5 h-4 w-4" />Sao lưu</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsPanel /></TabsContent>
          <TabsContent value="blog"><BlogPanel /></TabsContent>
          <TabsContent value="settings"><SettingsPanel /></TabsContent>
          <TabsContent value="hero"><HeroVideoPanel /></TabsContent>
          <TabsContent value="inbox"><InboxPanel /></TabsContent>
          <TabsContent value="backup"><BackupPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

// ---------- Products ----------
function ProductsPanel() {
  const { products } = useSiteData();
  const [editing, setEditing] = useState<Product | null>(null);

  const blank = (): Product => ({
    id: `p_${Date.now()}`, slug: "", name: "", image: "", tag: "", price: "", weight: "",
    shortDesc: "", longDesc: "", order: products.length + 1,
  });

  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing(blank())}><Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm</Button>
      </div>
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="grid grid-cols-[60px_1fr_120px_120px] gap-2 border-b bg-muted/50 px-3 py-2 text-xs font-semibold sm:grid-cols-[60px_1fr_120px_120px_160px]">
          <span>Ảnh</span><span>Tên</span><span>Giá</span><span className="hidden sm:block">Tag</span><span className="text-right">Thao tác</span>
        </div>
        {products.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">Chưa có sản phẩm</div>}
        {products.map((p) => (
          <div key={p.id} className="grid grid-cols-[60px_1fr_120px_120px] items-center gap-2 border-b px-3 py-2 text-sm last:border-b-0 sm:grid-cols-[60px_1fr_120px_120px_160px]">
            <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
            <div className="min-w-0">
              <div className="truncate font-medium">{p.name}</div>
              <div className="truncate text-xs text-muted-foreground">{p.slug}</div>
            </div>
            <div>{p.price}</div>
            <div className="hidden sm:block"><span className="rounded-full bg-muted px-2 py-0.5 text-xs">{p.tag || "—"}</span></div>
            <div className="flex justify-end gap-1">
              <Button size="icon" variant="ghost" onClick={() => moveProduct(p.id, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => moveProduct(p.id, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(p)}>Sửa</Button>
              <Button size="icon" variant="ghost" onClick={() => { if (confirm(`Xoá ${p.name}?`)) deleteProduct(p.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>
      {editing && <ProductEditor product={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ProductEditor({ product, onClose }: { product: Product; onClose: () => void }) {
  const [p, setP] = useState<Product>(product);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    set("image", await fileToDataUrl(f));
  };

  const save = () => {
    if (!p.name.trim() || !p.price.trim()) { toast.error("Cần có tên và giá"); return; }
    if (!p.slug.trim()) p.slug = p.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    upsertProduct(p);
    toast.success("Đã lưu sản phẩm");
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>{product.name ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Tên"><Input value={p.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Slug (URL)"><Input value={p.slug} onChange={(e) => set("slug", e.target.value)} placeholder="tu-dong-tao" /></Field>
            <Field label="Giá"><Input value={p.price} onChange={(e) => set("price", e.target.value)} placeholder="120.000đ" /></Field>
            <Field label="Khối lượng / quy cách"><Input value={p.weight} onChange={(e) => set("weight", e.target.value)} placeholder="500g" /></Field>
            <Field label="Tag (Bán chạy / Mới…)"><Input value={p.tag ?? ""} onChange={(e) => set("tag", e.target.value)} /></Field>
            <Field label="Thứ tự"><Input type="number" value={p.order ?? 0} onChange={(e) => set("order", Number(e.target.value))} /></Field>
          </div>
          <Field label="Mô tả ngắn"><Input value={p.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} /></Field>
          <Field label="Mô tả chi tiết"><Textarea rows={5} value={p.longDesc ?? ""} onChange={(e) => set("longDesc", e.target.value)} /></Field>
          <Field label="Ảnh sản phẩm">
            <div className="flex items-center gap-3">
              {p.image ? <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" /> : <div className="grid h-16 w-16 place-items-center rounded-lg bg-muted text-muted-foreground"><ImageIcon className="h-5 w-5" /></div>}
              <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
            <Input className="mt-2" placeholder="hoặc dán URL ảnh" value={p.image.startsWith("data:") ? "" : p.image} onChange={(e) => set("image", e.target.value)} />
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Lưu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

// ---------- Blog ----------
function BlogPanel() {
  const { blog } = useSiteData();
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const blank = (): BlogPost => ({
    id: `b_${Date.now()}`, slug: "", title: "", cover: "", excerpt: "", content: "",
    date: new Date().toISOString().slice(0, 10),
  });
  return (
    <div className="mt-4 space-y-4">
      <div className="flex justify-end"><Button onClick={() => setEditing(blank())}><Plus className="mr-2 h-4 w-4" /> Thêm bài</Button></div>
      <div className="space-y-2">
        {blog.length === 0 && <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">Chưa có bài viết</div>}
        {blog.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-xl border bg-card p-3">
            <img src={b.cover} alt="" className="h-14 w-20 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{b.title}</div>
              <div className="truncate text-xs text-muted-foreground">{b.date} · {b.excerpt}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => setEditing(b)}>Sửa</Button>
            <Button size="icon" variant="ghost" onClick={() => { if (confirm("Xoá bài?")) deleteBlog(b.id); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
      {editing && <BlogEditor post={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BlogEditor({ post, onClose }: { post: BlogPost; onClose: () => void }) {
  const [b, setB] = useState<BlogPost>(post);
  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) => setB((x) => ({ ...x, [k]: v }));
  const onFile = async (f: File | undefined) => { if (f) set("cover", await fileToDataUrl(f)); };
  const save = () => {
    if (!b.title.trim()) { toast.error("Cần có tiêu đề"); return; }
    if (!b.slug.trim()) b.slug = b.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    upsertBlog(b); toast.success("Đã lưu bài viết"); onClose();
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>{post.title ? "Sửa bài viết" : "Thêm bài viết"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Field label="Tiêu đề"><Input value={b.title} onChange={(e) => set("title", e.target.value)} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Slug"><Input value={b.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
            <Field label="Ngày đăng"><Input type="date" value={b.date} onChange={(e) => set("date", e.target.value)} /></Field>
          </div>
          <Field label="Tóm tắt"><Textarea rows={2} value={b.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
          <Field label="Nội dung"><Textarea rows={8} value={b.content} onChange={(e) => set("content", e.target.value)} /></Field>
          <Field label="Ảnh bìa">
            <div className="flex items-center gap-3">
              {b.cover ? <img src={b.cover} alt="" className="h-16 w-24 rounded-lg object-cover" /> : <div className="grid h-16 w-24 place-items-center rounded-lg bg-muted text-muted-foreground"><ImageIcon className="h-5 w-5" /></div>}
              <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
            </div>
          </Field>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Huỷ</Button>
          <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Lưu</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Settings ----------
function SettingsPanel() {
  const { settings } = useSiteData();
  const [s, setS] = useState<SiteSettings>(settings);
  useEffect(() => setS(settings), [settings]);
  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((x) => ({ ...x, [k]: v }));
  const save = () => { updateSettings(s); toast.success("Đã lưu thông tin"); };

  return (
    <div className="mt-4 space-y-4 rounded-xl border bg-card p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tên thương hiệu"><Input value={s.brandName} onChange={(e) => set("brandName", e.target.value)} /></Field>
        <Field label="Hotline (hiển thị)"><Input value={s.hotlineDisplay} onChange={(e) => set("hotlineDisplay", e.target.value)} /></Field>
        <Field label="Hotline (số gọi)"><Input value={s.hotlineTel} onChange={(e) => set("hotlineTel", e.target.value)} /></Field>
        <Field label="Giờ làm việc"><Input value={s.workingHours} onChange={(e) => set("workingHours", e.target.value)} /></Field>
        <Field label="Zalo URL"><Input value={s.zaloUrl} onChange={(e) => set("zaloUrl", e.target.value)} /></Field>
        <Field label="Messenger URL"><Input value={s.messengerUrl} onChange={(e) => set("messengerUrl", e.target.value)} /></Field>
        <Field label="Facebook URL"><Input value={s.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} /></Field>
        <Field label="Email"><Input value={s.email} onChange={(e) => set("email", e.target.value)} /></Field>
        <Field label="Địa chỉ"><Input value={s.address} onChange={(e) => set("address", e.target.value)} /></Field>
      </div>
      <Field label="Hero eyebrow"><Input value={s.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} /></Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tiêu đề dòng 1"><Input value={s.heroTitleLine1} onChange={(e) => set("heroTitleLine1", e.target.value)} /></Field>
        <Field label="Tiêu đề dòng 2"><Input value={s.heroTitleLine2} onChange={(e) => set("heroTitleLine2", e.target.value)} /></Field>
      </div>
      <Field label="Mô tả hero"><Textarea rows={3} value={s.heroDescription} onChange={(e) => set("heroDescription", e.target.value)} /></Field>
      <Field label="Footer note"><Input value={s.footerNote} onChange={(e) => set("footerNote", e.target.value)} /></Field>
      <div className="flex justify-end"><Button onClick={save}><Save className="mr-2 h-4 w-4" /> Lưu thông tin</Button></div>
    </div>
  );
}

// ---------- Hero video ----------
function HeroVideoPanel() {
  const { settings } = useSiteData();
  const [url, setUrl] = useState(settings.heroVideoUrl);
  useEffect(() => setUrl(settings.heroVideoUrl), [settings.heroVideoUrl]);

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { toast.error("File quá lớn (>8MB) — hãy dùng URL"); return; }
    setUrl(await fileToDataUrl(f));
  };

  return (
    <div className="mt-4 space-y-4 rounded-xl border bg-card p-5">
      <Field label="URL video (mp4)"><Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… hoặc /__l5e/…" /></Field>
      <Field label="Hoặc tải video lên (≤ 8MB, lưu local)">
        <Input type="file" accept="video/mp4" onChange={(e) => onFile(e.target.files?.[0])} />
      </Field>
      <div className="overflow-hidden rounded-xl border">
        <video key={url} src={url} controls className="aspect-video w-full bg-black" />
      </div>
      <div className="flex justify-end">
        <Button onClick={() => { updateSettings({ heroVideoUrl: url }); toast.success("Đã cập nhật video hero"); }}>
          <Save className="mr-2 h-4 w-4" /> Lưu video
        </Button>
      </div>
    </div>
  );
}

// ---------- Inbox ----------
function InboxPanel() {
  const { consultations } = useSiteData();
  return (
    <div className="mt-4 space-y-2">
      {consultations.length === 0 && <div className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">Chưa có yêu cầu tư vấn</div>}
      {consultations.map((c) => (
        <div key={c.id} className={`flex items-start gap-3 rounded-xl border bg-card p-4 ${c.handled ? "opacity-60" : ""}`}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{c.name}</span>
              <a href={`tel:${c.phone}`} className="text-sm text-primary hover:underline">{c.phone}</a>
              {c.handled && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Đã liên hệ</span>}
            </div>
            {c.message && <p className="mt-1 text-sm text-muted-foreground">{c.message}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString("vi-VN")}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toggleConsultation(c.id)}>
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> {c.handled ? "Bỏ đánh dấu" : "Đã liên hệ"}
          </Button>
          <Button size="icon" variant="ghost" onClick={() => deleteConsultation(c.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}

// ---------- Backup ----------
function BackupPanel() {
  const inputRef = useRef<HTMLInputElement>(null);

  const onExport = () => {
    const blob = new Blob([exportSiteData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `giahung-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
  };
  const onImport = async (f: File | undefined) => {
    if (!f) return;
    try { importSiteData(await f.text()); toast.success("Đã nhập dữ liệu"); }
    catch { toast.error("File không hợp lệ"); }
  };

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Xuất dữ liệu</h3>
        <p className="mt-1 text-sm text-muted-foreground">Tải file JSON chứa toàn bộ sản phẩm, bài viết, cài đặt, tư vấn.</p>
        <Button className="mt-3" onClick={onExport}><Download className="mr-2 h-4 w-4" /> Tải JSON</Button>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h3 className="font-semibold">Nhập dữ liệu</h3>
        <p className="mt-1 text-sm text-muted-foreground">Khôi phục từ file đã xuất trước đó (ghi đè dữ liệu hiện tại).</p>
        <input ref={inputRef} type="file" accept="application/json" hidden onChange={(e) => onImport(e.target.files?.[0])} />
        <Button variant="outline" className="mt-3" onClick={() => inputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Chọn file</Button>
      </div>
      <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-5 sm:col-span-2">
        <h3 className="font-semibold text-destructive">Khôi phục mặc định</h3>
        <p className="mt-1 text-sm text-muted-foreground">Xoá mọi thay đổi và đưa web về dữ liệu gốc.</p>
        <Button variant="destructive" className="mt-3" onClick={() => { if (confirm("Khôi phục về mặc định?")) { resetSiteData(); toast.success("Đã khôi phục"); } }}>
          <RefreshCw className="mr-2 h-4 w-4" /> Khôi phục
        </Button>
      </div>
    </div>
  );
}