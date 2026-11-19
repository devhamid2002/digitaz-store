"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { deleteProduct } from "@/features/admin/products/actions/product.action";
import type { AdminProductRow } from "@/features/admin/products/types/productRow";
import { useRouter } from "@/i18n/routing";
import { formatPrice, type Locale } from "@/utils/format";

type Props = {
  products: AdminProductRow[];
  locale: Locale;
};

export default function AdminProductsTable({ products, locale }: Props) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [productToDelete, setProductToDelete] =
    useState<AdminProductRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    const result = await deleteProduct(productToDelete.slug);
    setIsDeleting(false);

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("productDeleted") });
    setProductToDelete(null);
    router.refresh();
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>{t("productName")}</TableHead>
              <TableHead>{t("category")}</TableHead>
              <TableHead className="text-end">{t("price")}</TableHead>
              <TableHead className="text-end">{t("stock")}</TableHead>
              <TableHead className="text-end">
                <span className="sr-only">{t("actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon
                          aria-hidden="true"
                          className="size-4 text-muted-foreground"
                        />
                      )}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate font-medium">
                        {product.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {product.brand}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {product.category}
                </TableCell>
                <TableCell className="text-end font-medium tabular-nums">
                  {formatPrice(product.price, locale)}
                </TableCell>
                <TableCell
                  className={
                    product.stock === 0
                      ? "text-end tabular-nums text-destructive"
                      : "text-end tabular-nums"
                  }
                >
                  {product.stock.toLocaleString(locale)}
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={t("deleteProduct")}
                    title={t("deleteProduct")}
                    onClick={() => setProductToDelete(product)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setProductToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteProduct")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteProductConfirm", {
                name: productToDelete?.name ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setProductToDelete(null)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
            >
              <Trash2 aria-hidden="true" />
              {isDeleting ? t("deleting") : t("delete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
