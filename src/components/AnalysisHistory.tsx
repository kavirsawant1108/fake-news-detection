import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Trash2, AlertCircle, CheckCircle, Clock, TrendingDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Analysis {
  id: string;
  article_text: string;
  prediction: "real" | "fake";
  confidence: number;
  word_count: number;
  emotional_words: number;
  clickbait_score: number;
  source_citations: number;
  created_at: string;
}

const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setAnalyses((data || []) as Analysis[]);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      toast({
        title: "Error",
        description: "Failed to load analysis history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("analyses-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "analyses",
        },
        () => {
          fetchAnalyses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase.from("analyses").delete().eq("id", id);

      if (error) throw error;

      setAnalyses(analyses.filter((a) => a.id !== id));
      toast({
        title: "Deleted",
        description: "Analysis removed from history",
      });
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analyses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Analysis History
          </CardTitle>
          <CardDescription>Your recent news analyses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingDown className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No analyses yet. Start by analyzing some news articles!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Analysis History
        </CardTitle>
        <CardDescription>
          {analyses.length} recent {analyses.length === 1 ? "analysis" : "analyses"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {analysis.prediction === "real" ? (
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                        )}
                        <Badge
                          variant={analysis.prediction === "real" ? "default" : "destructive"}
                          className="capitalize"
                        >
                          {analysis.prediction}
                        </Badge>
                        <Badge variant="outline">{analysis.confidence}% confidence</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {analysis.article_text}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{analysis.word_count} words</span>
                        <span>•</span>
                        <span>{analysis.emotional_words} emotional</span>
                        <span>•</span>
                        <span>{analysis.clickbait_score} clickbait</span>
                        <span>•</span>
                        <span>{analysis.source_citations} sources</span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAnalysis(analysis.id)}
                      className="flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AnalysisHistory;
