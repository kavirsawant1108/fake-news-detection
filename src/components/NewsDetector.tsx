import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface AnalysisResult {
  prediction: "real" | "fake";
  confidence: number;
  features: {
    wordCount: number;
    emotionalWords: number;
    clickbaitScore: number;
    sourceCitations: number;
  };
}

const NewsDetector = () => {
  const [newsText, setNewsText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeNews = async () => {
    if (!newsText.trim()) {
      toast({
        title: "Please enter news text",
        description: "Paste or type the news article you want to analyze.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    try {
      // Call AI-powered Edge Function (public, no auth needed)
      const response = await fetch(
        "https://ggfrewjzokenahhicbjc.supabase.co/functions/v1/analyze-news",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: newsText }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Feature analysis
      const words = newsText.split(/\s+/).length;
      const emotionalKeywords = ["shocking", "unbelievable", "outrageous", "scandal", "amazing", "incredible"];
      const emotionalCount = emotionalKeywords.reduce(
        (count, keyword) =>
          count + (newsText.toLowerCase().match(new RegExp(keyword, "g"))?.length || 0),
        0
      );
      const clickbaitPatterns = /!{2,}|\?{2,}|BREAKING|EXCLUSIVE|YOU WON'T BELIEVE/gi;
      const clickbaitMatches = newsText.match(clickbaitPatterns)?.length || 0;
      const citationPatterns = /according to|source:|reports from|study shows/gi;
      const citations = newsText.match(citationPatterns)?.length || 0;

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        features: {
          wordCount: words,
          emotionalWords: emotionalCount,
          clickbaitScore: clickbaitMatches,
          sourceCitations: citations,
        },
      });

      // Optional: Save to database if user logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: dbError } = await supabase.from("analyses").insert({
          user_id: user.id,
          article_text: newsText.substring(0, 5000),
          prediction: data.prediction,
          confidence: data.confidence,
          word_count: words,
          emotional_words: emotionalCount,
          clickbait_score: clickbaitMatches,
          source_citations: citations,
        });

        if (dbError) console.error("Insert error:", dbError);
      }

      toast({
        title: "Analysis Complete",
        description: `This article appears to be ${data.prediction} with ${data.confidence.toFixed(1)}% confidence.`,
      });

    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze the article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const loadSample = (type: "fake" | "real") => {
    const samples = {
      fake: "BREAKING!!! You WON'T BELIEVE what scientists just discovered! This SHOCKING finding will change EVERYTHING you thought you knew about health! Doctors are OUTRAGED and trying to hide this incredible secret! Share this before it gets deleted!!!",
      real: "According to a peer-reviewed study published in the Journal of Medical Research, researchers at Stanford University have identified a potential correlation between diet and cardiovascular health. The study, which examined 5,000 participants over five years, suggests that increased fiber intake may reduce heart disease risk by up to 15%. Dr. Sarah Johnson, lead researcher, notes that further investigation is needed to confirm these preliminary findings."
    };
    setNewsText(samples[type]);
    setResult(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Analyze News Article
          </CardTitle>
          <CardDescription>
            Paste a news article or headline to check its authenticity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your news article text here..."
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
            className="min-h-[300px] resize-none"
          />
          <div className="flex gap-2">
            <Button onClick={analyzeNews} disabled={analyzing} className="flex-1">
              {analyzing ? "Analyzing..." : "Analyze Article"}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => loadSample("fake")} className="flex-1">
              Load Fake Sample
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadSample("real")} className="flex-1">
              Load Real Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Analysis Results
          </CardTitle>
          <CardDescription>
            AI-powered classification and feature analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-6">
              {/* Classification Badge */}
              <div className="flex items-center justify-between p-4 rounded-lg border-2"
                   style={{
                     borderColor: result.prediction === "real" ? "hsl(var(--success))" : "hsl(var(--destructive))",
                     backgroundColor: result.prediction === "real" ? "hsl(var(--success-light))" : "hsl(var(--destructive-light))"
                   }}>
                <div className="flex items-center gap-3">
                  {result.prediction === "real" ? (
                    <CheckCircle className="h-8 w-8 text-success" />
                  ) : (
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Classification</p>
                    <p className="text-2xl font-bold capitalize">
                      {result.prediction} News
                    </p>
                  </div>
                </div>
                <Badge variant={result.prediction === "real" ? "default" : "destructive"} className="text-lg px-4 py-2">
                  {result.confidence.toFixed(1)}%
                </Badge>
              </div>

              {/* Confidence Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence Level</span>
                  <span className="font-semibold">{result.confidence.toFixed(1)}%</span>
                </div>
                <Progress value={result.confidence} className="h-3" />
              </div>

              {/* Feature Analysis */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Feature Analysis</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Word Count</p>
                    <p className="text-xl font-bold text-foreground">{result.features.wordCount}</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Emotional Words</p>
                    <p className="text-xl font-bold text-foreground">{result.features.emotionalWords}</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Clickbait Score</p>
                    <p className="text-xl font-bold text-foreground">{result.features.clickbaitScore}</p>
                  </div>
                  <div className="p-3 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Source Citations</p>
                    <p className="text-xl font-bold text-foreground">{result.features.sourceCitations}</p>
                  </div>
                </div>
              </div>

              {/* Key Indicators */}
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold">Key Indicators</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {result.features.clickbaitScore > 0 && <li>• High clickbait patterns detected</li>}
                  {result.features.emotionalWords > 2 && <li>• Excessive emotional language</li>}
                  {result.features.sourceCitations === 0 && <li>• No credible sources cited</li>}
                  {result.features.sourceCitations > 0 && <li>• Contains source citations</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Shield className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Enter a news article and click "Analyze" to see results
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsDetector;