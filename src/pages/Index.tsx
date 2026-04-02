import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import NewsDetector from "@/components/NewsDetector";
import Architecture from "@/components/Architecture";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import AnalysisHistory from "@/components/AnalysisHistory";
import BatchAnalysis from "@/components/BatchAnalysis";

import { Shield, LogOut, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
  await supabase.auth.signOut();

  navigate("/auth");
};

  // ✅ CHECK SESSION
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.log(error);
      }

      setUser(data.session?.user ?? null);
      setLoading(false);

      // redirect only on localhost
      if (!data.session && window.location.hostname === "localhost") {
        navigate("/auth");
      }
    };

    checkSession();

    // ✅ listen auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (!session && window.location.hostname === "localhost") {
        navigate("/auth");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // ✅ LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Fake News Detection System
              </h1>
              <p className="text-sm text-muted-foreground">
                AI Powered Truth Verification
              </p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-3">
              <User size={18} />
              <span>{user.email}</span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="detector">

          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="detector">Detector</TabsTrigger>
            <TabsTrigger value="batch">Batch</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="detector">
            <NewsDetector />
          </TabsContent>

          <TabsContent value="batch">
            <BatchAnalysis />
          </TabsContent>

          <TabsContent value="history">
            <AnalysisHistory />
          </TabsContent>

          <TabsContent value="architecture">
            <Architecture />
          </TabsContent>

          <TabsContent value="metrics">
            <PerformanceMetrics />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
};

export default Index;