"use client";

import { logOutUser } from "@/lib/actions/general.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import Loader from "./Loader";
import { toast } from "sonner";

const LogoutBtn = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await logOutUser();
      if (result.success) {
        toast.success("Logged out successfully");
        router.push("/sign-in");
      }
    } catch (error) {
      console.log(error);
    } finally {
        setLoading(false);
    }
  };
  return <Button className="btn-primary w-32!" onClick={handleLogout}>
    {loading ? <Loader size="small" />: 'Logout'}
  </Button>;
};

export default LogoutBtn;
