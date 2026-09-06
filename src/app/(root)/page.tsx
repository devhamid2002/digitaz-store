import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-black">دیجیتاز استور</h1>
      <p className="text-muted-foreground">فروشگاه فارسی با فونت وزیرمتن - Vazirmatn</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button>دکمه اصلی</Button>
        <Button variant="secondary">ثانویه</Button>
        <Button variant="outline">outline</Button>
        <Button variant="ghost">ghost</Button>
        <Button variant="destructive">حذف</Button>
        <Button variant="link">لینک</Button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="xs">خیلی کوچک</Button>
        <Button size="sm">کوچک</Button>
        <Button size="lg">بزرگ</Button>
        <Button size="icon" aria-label="icon">
          ★
        </Button>
      </div>
    </main>
  );
}
