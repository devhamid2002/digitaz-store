type Props = {
    children: React.ReactNode
}

export default function layout({children}: Props) {
  return (
    <>
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
            {children}
        </div>
    </>
  )
}