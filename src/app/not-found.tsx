import Image from "next/image"
import notFound from "../../public/images/404-image.webp"

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-between">
        <Image src={notFound} width={630} height={500} alt="not-found" className="mt-12"/>
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
           <h1 className="text-5xl font-bold">اوه... صفحه مورد نظر پیدا نشد</h1>
           <p className="text-gray-400 mt-6">صفحه ای که به دنبال آن میگردید وجود ندارد و یا اینکه خطای دیگری</p>
           <p className="text-gray-400">اتفاق افتاده است. برو به <span className="text-blue-700"> صفحه اصلی</span></p>
        </div>
    </div>
  )
}