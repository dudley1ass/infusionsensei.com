import { Link } from "react-router";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { FORMSUBMIT_CONTACT_ACTION } from "../constants/contact";

type RecipeIdeaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RecipeIdeaDialog({ open, onOpenChange }: RecipeIdeaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white text-gray-900 shadow-2xl border-green-200/80">
        <form action={FORMSUBMIT_CONTACT_ACTION} method="POST" className="space-y-4">
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="Recipe suggestion — Infusion Sensei" />
          <DialogHeader>
            <DialogTitle>Suggest a recipe</DialogTitle>
            <DialogDescription className="text-gray-600">
              What would you like to see in the library? We read every note — delivered the same way as{" "}
              <Link to="/contact-us" className="text-green-700 font-semibold underline">
                Contact Us
              </Link>
              .
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="header-recipe-suggest-name" className="text-sm font-bold text-gray-700">
              Name <span className="font-normal text-gray-500">(optional)</span>
            </Label>
            <Input
              id="header-recipe-suggest-name"
              name="name"
              type="text"
              autoComplete="name"
              className="mt-1 bg-white border-green-200"
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="header-recipe-suggest-email" className="text-sm font-bold text-gray-700">
              Email
            </Label>
            <Input
              id="header-recipe-suggest-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 bg-white border-green-200"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <Label htmlFor="header-recipe-suggest-message" className="text-sm font-bold text-gray-700">
              Recipe you&apos;d like to see
            </Label>
            <Textarea
              id="header-recipe-suggest-message"
              name="message"
              required
              rows={5}
              className="mt-1 bg-white border-green-200 resize-y min-h-[100px]"
              placeholder="e.g. Sheet-pan infused granola bars, mg per square…"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto">
              <Send className="w-4 h-4 mr-2" /> Send suggestion
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
