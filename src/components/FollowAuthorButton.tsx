import { useEffect, useState } from "react";
import { Heart, UserPlus, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const FollowAuthorButton = ({ authorId }: { authorId: string }) => {
  const { user } = useAuth();
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("author_follows").select("id").eq("follower_id", user.id).eq("author_id", authorId).maybeSingle()
      .then(({ data }) => setFollowing(!!data));
  }, [user?.id, authorId]);

  const toggle = async () => {
    if (!user) { toast.error("Connectez-vous pour suivre cet auteur"); return; }
    if (user.id === authorId) return;
    setLoading(true);
    if (following) {
      await supabase.from("author_follows").delete().eq("follower_id", user.id).eq("author_id", authorId);
      setFollowing(false);
      toast.success("Auteur retiré de vos suivis");
    } else {
      await supabase.from("author_follows").insert({ follower_id: user.id, author_id: authorId });
      setFollowing(true);
      toast.success("Vous suivez désormais cet auteur");
    }
    setLoading(false);
  };

  if (user?.id === authorId) return null;

  return (
    <Button onClick={toggle} disabled={loading} variant={following ? "outline" : "default"} size="sm" className="gap-2">
      {following ? <><UserCheck className="w-4 h-4" /> Suivi</> : <><UserPlus className="w-4 h-4" /> Suivre</>}
    </Button>
  );
};
export default FollowAuthorButton;
