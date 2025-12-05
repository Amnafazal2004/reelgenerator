"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";  // your client wrapper
import { toast } from "sonner";

const Signout = () => {
  const handleSignOut = async () => {
    try {
      await authClient.signOut(); // <-- this clears cookie + ends session
      toast(" Signed out successfully");
    } catch (error) {
      console.error("Signout error:", error);
      toast("Failed to sign out");
    }
  };

  return (
    <Button onClick={handleSignOut} className="mr-24 text-[10px]" variant="custom1">Sign Out</Button>
  );
};

export default Signout;
