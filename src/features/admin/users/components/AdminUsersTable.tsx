"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import EditUserForm from "@/features/admin/users/components/EditUserForm";
import { deleteUser } from "@/features/admin/users/actions/user.action";
import type { userType } from "@/features/admin/users/types/userRow";
import { useRouter } from "@/i18n/routing";
import { formatDateTime, type Locale } from "@/utils/format";

type Props = {
  users: userType[];
  locale: Locale;
};

function displayName(user: userType): string {
  return user.name === "NO_NAME" ? "—" : user.name;
}

export default function AdminUsersTable({ users, locale }: Props) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [userToEdit, setUserToEdit] = useState<userType | null>(null);
  const [userToDelete, setUserToDelete] = useState<userType | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    const result = await deleteUser(userToDelete.id);
    setIsDeleting(false);

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("userDeleted") });
    setUserToDelete(null);
    router.refresh();
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>{t("user")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("joinedAt")}</TableHead>
              <TableHead className="text-end">
                <span className="sr-only">{t("actions")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{displayName(user)}</span>
                    <span className="text-xs text-muted-foreground">
                      <bdi dir="ltr">{user.email ?? "—"}</bdi>
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span dir="ltr" className="tabular-nums">
                    {user.phone ?? "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role === "admin" ? t("roleAdmin") : t("roleUser")}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(user.createdAt, locale)}
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("editUser")}
                      title={t("editUser")}
                      onClick={() => setUserToEdit(user)}
                    >
                      <Pencil aria-hidden="true" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      aria-label={t("deleteUser")}
                      title={t("deleteUser")}
                      onClick={() => setUserToDelete(user)}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={Boolean(userToEdit)}
        onOpenChange={(open) => {
          if (!open) setUserToEdit(null);
        }}
      >
        <DialogContent closeLabel={t("close")}>
          {userToEdit && (
            <EditUserForm
              key={userToEdit.id}
              user={userToEdit}
              onCancel={() => setUserToEdit(null)}
              onSaved={() => {
                setUserToEdit(null);
                router.refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setUserToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteUser")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteUserConfirm", {
                name: userToDelete ? displayName(userToDelete) : "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setUserToDelete(null)}
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
