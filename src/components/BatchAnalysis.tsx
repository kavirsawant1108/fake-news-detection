import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface BatchResult {
  text: string;
  prediction: "real" | "fake";
  confidence: number;
  status: "pending" | "processing" | "complete" | "error";
}

const BatchAnalysis = () => {
  const [articles, setArticles] = useState("");
  const [results, setResults] = useState<BatchResult[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const analyzeArticle = async (text: string): Promise<BatchResult> => {
    try {
      const { data, error } = await supabase.functions.invoke("analyze-news", {
        body: { text },
      });

      if (error) throw error;

      // Save to database
      const words = text.split(/\s+/).length;
      const emotionalKeywords = ["shocking", "unbelievable", "outrageous", "scandal", "amazing", "incredible"];
      const emotionalCount = emotionalKeywords.reduce(
        (count, keyword) => count + (text.toLowerCase().match(new RegExp(keyword, "g"))?.length || 0),
        0
      );
      const clickbaitPatterns = /!{2,}|\?{2,}|BREAKING|EXCLUSIVE|YOU WON'T BELIEVE/gi;
      const clickbaitMatches = text.match(clickbaitPatterns)?.length || 0;
      const citationPatterns = /according to|source:|reports from|study shows/gi;
      const citations = text.match(citationPatterns)?.length || 0;

      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase.from("analyses").insert({
          user_id: session.session.user.id,
          article_text: text.substring(0, 5000),
          prediction: data.prediction,
          confidence: data.confidence,
          word_count: words,
          emotional_words: emotionalCount,
          clickbait_score: clickbaitMatches,
          source_citations: citations,
        });
      }

      return {
        text,
        prediction: data.prediction,
        confidence: data.confidence,
        status: "complete",
      };
    } catch (error) {
      console.error("Analysis error:", error);
      return {
        text,
        prediction: "fake",
        confidence: 0,
        status: "error",
      };
    }
  };

  const handleBatchAnalysis = async () => {
    const articleList = articles
      .split("\n\n")
      .map((a) => a.trim())
      .filter((a) => a.length > 50);

    if (articleList.length === 0) {
      toast({
        title: "No articles found",
        description: "Please enter at least one article (separated by blank lines)",
        variant: "destructive",
      });
      return;
    }

    if (articleList.length > 10) {
      toast({
        title: "Too many articles",
        description: "Please limit batch analysis to 10 articles at a time",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    
    const initialResults: BatchResult[] = articleList.map((text) => ({
      text,
      prediction: "fake",
      confidence: 0,
      status: "pending",
    }));
    
    setResults(initialResults);

    for (let i = 0; i < articleList.length; i++) {
      setResults((prev) =>
        prev.map((r, idx) => (idx === i ? { ...r, status: "processing" } : r))
      );

      const result = await analyzeArticle(articleList[i]);
      
      setResults((prev) =>
        prev.map((r, idx) => (idx === i ? result : r))
      );
      
      setProgress(((i + 1) / articleList.length) * 100);
    }

    setProcessing(false);
    toast({
      title: "Batch analysis complete",
      description: `Analyzed ${articleList.length} articles`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Batch Analysis
          </CardTitle>
          <CardDescription>
            Analyze multiple articles at once (separate with blank lines, max 10)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste multiple articles here, separated by blank lines..."
            value={articles}
            onChange={(e) => setArticles(e.target.value)}
            className="min-h-[200px] resize-none"
            disabled={processing}
          />

          <Button
            onClick={handleBatchAnalysis}
            disabled={processing || !articles.trim()}
            className="w-full"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing {results.filter((r) => r.status === "complete").length} /{" "}
                {results.length}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Batch
              </>
            )}
          </Button>

          {processing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {Math.round(progress)}% complete
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Batch Results</CardTitle>
            <CardDescription>
              {results.filter((r) => r.status === "complete").length} of {results.length}{" "}
              completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg flex items-start justify-between gap-3"
                >
                  <div className="flex-1 space-y-2">
                    <p className="text-sm line-clamp-2">{result.text}</p>
                    {result.status === "complete" && (
                      <div className="flex items-center gap-2">
                        {result.prediction === "real" ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                        <Badge
                          variant={
                            result.prediction === "real" ? "default" : "destructive"
                          }
                          className="capitalize"
                        >
                          {result.prediction}
                        </Badge>
                        <Badge variant="outline">{result.confidence}%</Badge>
                      </div>
                    )}
                    {result.status === "processing" && (
                      <div className="flex items-center gap-2 text-primary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Analyzing...</span>
                      </div>
                    )}
                    {result.status === "error" && (
                      <Badge variant="destructive">Analysis failed</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BatchAnalysis;
