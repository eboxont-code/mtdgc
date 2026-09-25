import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function WishlistButton({ productId }: { productId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: row } = await supabase
          .from("wishlist_items")
          .select("product_id")
          .eq("product_id", productId)
          .maybeSingle();
        if (active) setSaved(Boolean(row));
      }
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [productId]);

  if (!ready) return null;

  if (!userId) {
    return (
      <Button asChild variant="ghost" size="lg">
        <Link to="/auth">
          <Heart className="size-4" aria-hidden="true" /> Sign in to save
        </Link>
      </Button>
    );
  }

  async function toggle() {
    if (busy || !userId) return;
    setBusy(true);
    if (saved) {
      const { error } = await supabase.from("wishlist_items").delete().eq("product_id", productId).eq("user_id", userId);
      if (!error) setSaved(false);
    } else {
      const { error } = await supabase.from("wishlist_items").insert({ product_id: productId, user_id: userId });
      if (!error) setSaved(true);
    }
    setBusy(false);
  }

  return (
    <Button variant="ghost" size="lg" onClick={toggle} disabled={busy} aria-pressed={saved}>
      <Heart className={saved ? "size-4 fill-current" : "size-4"} aria-hidden="true" />
      {saved ? "Saved to wishlist" : "Save to wishlist"}
    </Button>
  );
}
