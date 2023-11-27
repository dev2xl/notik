import { useForm } from "react-hook-form";
import { CreateNoteInput, createNoteSchema } from "@/lib/validations/note";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import { Note } from "@/interfaces/Note";
import { useState } from "react";

export type AddModalDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
};

const AddEditNoteDialog = ({
  open,
  setOpen,
  noteToEdit,
}: AddModalDialogProps) => {
  const router = useRouter();

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  const [deleteInProgress, setDeleteInProgress] = useState(false);

  /**
   * Handle Update note
   * @param data
   */
  const handleUpdate = async (data: CreateNoteInput) => {
    const res = await fetch("/api/notes", {
      method: "PUT",
      body: JSON.stringify({ ...data, _id: noteToEdit!._id }),
    });

    if (!res.ok) {
      throw new Error("Something went wrong. Status: " + res.status);
    }

    router.refresh();
    setOpen(false);
  };

  /**
   * Handle Create note
   * @param data
   */
  const handleCreate = async (data: CreateNoteInput) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Something went wrong. Status: " + res.status);
    }

    form.reset();
    router.refresh();
    setOpen(false);
  };

  /**
   * Handle Delete note
   */
  const handleDelete = async () => {
    setDeleteInProgress(true);

    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ _id: noteToEdit!._id }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Status: " + res.status);
      }

      router.refresh();
      setOpen(false);
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again");
    }

    setDeleteInProgress(false);
  };

  /**
   * On Submit
   * @param data
   */
  const onSubmit = async (data: CreateNoteInput) => {
    try {
      if (noteToEdit) {
        await handleUpdate(data);
      } else {
        await handleCreate(data);
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Write the note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Use your imagination" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  loading={deleteInProgress}
                  variant={"destructive"}
                  type="button"
                  onClick={handleDelete}
                  disabled={form.formState.isSubmitting || deleteInProgress}
                >
                  Delete
                </LoadingButton>
              )}
              <LoadingButton
                loading={form.formState.isSubmitting}
                type="submit"
                disabled={form.formState.isSubmitting || deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditNoteDialog;
